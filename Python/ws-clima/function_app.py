import json # std
import string # std
import unicodedata # std
import datetime as DateTime # std
import azure.functions as func # externo
from requests_html import HTMLSession # externo

app = func.FunctionApp( http_auth_level = func.AuthLevel.ANONYMOUS )
SERVIDOR = "https://www.climatempo.com.br"
cacheURI = {}
THROTTLING = {
    "constants": {
        "maxRequests": 10,
        "period": DateTime.timedelta( minutes = 1 )
    },
    "current": {
        "requests": 0,
        "resetsAt": None
    }
}

class Resultado:
    sucesso: bool
    mensagem: str
    resultados: list[any]

    def __init__( self, sucesso: bool = True, mensagem: str = "", resultados: list = [] ) -> None:
        self.sucesso = sucesso
        self.mensagem = mensagem
        self.resultados = resultados
    
    def __str__( self ) -> str:
        return json.dumps({
            "sucesso": self.sucesso,
            "mensagem": self.mensagem,
            "resultados": self.resultados
        }, ensure_ascii = False)

def normalizar( string: str ) -> str:
    """Remover acento, lower(), strip()"""
    nfkd = unicodedata.normalize('NFKD', string)
    ascii = nfkd.encode('ASCII', 'ignore')
    return ascii.decode("utf8").strip().lower()

async def throttling( now: DateTime.datetime ) -> Resultado:
    # Reset expiration
    if THROTTLING["current"]["resetsAt"] is None or now > THROTTLING["current"]["resetsAt"]:
        THROTTLING["current"]["resetsAt"] = now + THROTTLING["constants"]["period"]
        THROTTLING["current"]["requests"] = 0
    
    # Current requests exceeded
    if THROTTLING["current"]["requests"] == THROTTLING["constants"]["maxRequests"]:
        retry: DateTime.timedelta = THROTTLING["current"]["resetsAt"] - now
        return Resultado( False, f'Retry in { int(retry.total_seconds()) }s', [] )

    THROTTLING["current"]["requests"] += 1
    return Resultado( True, "", [] )

async def helperURI( estado: str, cidade: str ) -> Resultado:
    estado, cidade = normalizar(estado), normalizar(cidade)
    if estado in cacheURI and cidade in cacheURI[estado]:
        return Resultado( True, "", [cacheURI[estado][cidade]] )

    try:
        session = HTMLSession()
        response = session.get( f"{SERVIDOR}/previsao-do-tempo" )
        if response.status_code != 200:
            raise Exception("Status code diferente do esperado")
        
        for char in string.ascii_uppercase:
            cidades = response.html.find( f"#letter-{char}", first = True )
            if cidades is None: break
            cidades = cidades.find( "a" )
            if cidades is None: break

            for a in cidades:
                if not hasattr(a, 'attrs') or not hasattr(a, 'text') or "href" not in a.attrs: break
                aCidade, aEstado = normalizar( a.text ).split( ", " )
                if aEstado not in cacheURI: cacheURI[ aEstado ] = {}
                cacheURI[ aEstado ][ aCidade ] = a.attrs["href"]
        
        if estado in cacheURI and cidade in cacheURI[estado]:
            return Resultado( True, "", [cacheURI[estado][cidade]] )
        else: raise Exception("URI não foi encontrada")
    
    except Exception as e:
        return Resultado( False, f"Erro ao obter o URI da Cidade/Estado: {e}", [] )

async def helperPrevisao( uri: str ) -> Resultado:
    try:
        session = HTMLSession()
        response = session.get( f"{SERVIDOR}{uri}" )
        if response.status_code != 200:
            raise Exception("Status code diferente do esperado")
    
        div = response.html.find( ".wrapper-chart", first = True )
        if not hasattr(div, "attrs") or div.attrs == None or "data-infos" not in div.attrs:
            raise Exception("Previsão não localizada no HTML")
        
        resultado = Resultado( True, "", [] )
        infos: list[dict] = json.loads( div.attrs["data-infos"].replace("&quot;", '"') )

        for info in infos:
            resultado.resultados.append({
                "data": info["day"],
                "diaSemana": info["dayWeekFullMin"],
                "resumo": info["textIcon"]["text"]["pt"],
                "temperatura": f"entre { info['temperature']['min'] } e { info['temperature']['max'] }",
                "sol": f"entre { info['sun']['sunshine'] } e { info['sun']['sunset'] }",
                "chuva": f"probabilidade de { info['rain']['probability'] }% com precipitação de { info['rain']['precipitation'] }mm",
                "arco-íris": info["rainbow"]["text"]
            })
        
        if len(resultado.resultados) == 0:
            raise Exception("Nenhuma previsão encontrada")
        else: return resultado
    
    except Exception as e:
        return Resultado( False, f"Erro ao obter o Clima: {e}", [] )

async def helperAgora( uri: str ) -> Resultado:
    try:
        session = HTMLSession()
        response = session.get( f"{SERVIDOR}{uri}" )
        if response.status_code != 200:
            raise Exception("Status code diferente do esperado")

        temperatura: str = response.html.xpath( '//*[@id="mainContent"]/div[4]/div[5]/div[1]/div[2]/div[1]/div/div[2]/span', first = True )
        if temperatura is None:
            raise Exception("Temperatura não localizada no HTML")

        div = response.html.find( "div.no-gutters.-gray._flex._justify-center._margin-t-20._padding-b-20._border-b-light-1", first = True )
        ceu = div.find("span")[0].text if div is not None and div.find("span") is not None else None
        sensacao = div.find("span")[1].text if div is not None and div.find("span") is not None else None
        descricao = response.html.xpath( '//*[@id="mainContent"]/div[4]/div[5]/div[1]/div[2]/div[1]/div/div[1]/h1', first = True )

        return Resultado( True, resultados = [{
            "temperatura": f"{temperatura.text} C",
            "sensação": f'{ sensacao.split("- ")[1] } C' if sensacao is not None else None,
            "céu": ceu,
            "descricao": descricao.text if descricao is not None else None
        }])        
    
    except Exception as e:
        return Resultado( False, f"Erro ao obter o Clima: {e}", [] )

@app.function_name( "clima-estado-cidade-previsao" )
@app.route( route = r"clima/estado/{estado}/cidade/{cidade}/previsao", methods = ["GET"] )
async def obterClimaPrevisao( req: func.HttpRequest ) -> func.HttpResponse:
    t = await throttling( DateTime.datetime.utcnow() )
    if not t.sucesso:
        return func.HttpResponse(
            body = str(t),
            status_code = 429,
            mimetype = "application/json"
        )
    
    estado, cidade = req.route_params.get("estado"), req.route_params.get("cidade")
    resultado = await helperURI( estado, cidade )
    if not resultado.sucesso:
        return func.HttpResponse(
            status_code = 500,
            body = str(resultado),
            mimetype = "application/json"
        )

    uri15Dias = resultado.resultados[0].replace("agora", "15-dias")
    resultado = await helperPrevisao( uri15Dias )
    if not resultado.sucesso:
        return func.HttpResponse(
            status_code = 500,
            body = str(resultado),
            mimetype = "application/json"
        )

    resultado.mensagem = f"fonte {SERVIDOR}"
    return func.HttpResponse(
        status_code = 200,
        body = str(resultado),
        mimetype = "application/json"
    )

@app.function_name( "clima-estado-cidade-agora" )
@app.route( route = r"clima/estado/{estado}/cidade/{cidade}/agora", methods = ["GET"] )
async def obterClimaAgora( req: func.HttpRequest ) -> func.HttpResponse:
    t = await throttling( DateTime.datetime.utcnow() )
    if not t.sucesso:
        return func.HttpResponse(
            body = str(t),
            status_code = 429,
            mimetype = "application/json"
        )
    
    estado, cidade = req.route_params.get("estado"), req.route_params.get("cidade")
    resultado = await helperURI( estado, cidade )
    if not resultado.sucesso:
        return func.HttpResponse(
            status_code = 500,
            body = str(resultado),
            mimetype = "application/json"
        )
    
    uriAgora = resultado.resultados[0]
    resultado = await helperAgora( uriAgora )
    if not resultado.sucesso:
        return func.HttpResponse(
            status_code = 500,
            body = str(resultado),
            mimetype = "application/json"
        )

    resultado.mensagem = f"fonte {SERVIDOR}"
    return func.HttpResponse(
        status_code = 200,
        body = str(resultado),
        mimetype = "application/json"
    )