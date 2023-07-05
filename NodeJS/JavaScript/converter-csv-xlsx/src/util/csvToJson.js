/**
 * Obter os nomes dos headers do .csv
 * @param   { String } primeiraLinha Primeira linha do .csv
 * @param   { String } separador Char do separador das células
 * @returns { Promisse< Array<String> > } Array com os nomes dos headers
 */
async function obter_headers( primeiraLinha, separador ){
    return primeiraLinha
        .replace( "\ufeff", "" )
        .split( separador )
}

/**
 * Obter o separador das células do .csv    
 * Procura por ";" ou ","
 * @param   { String } primeiraLinha Primeira linha do .csv
 * @returns { Promisse< String > } Char do separador
 */
async function obter_separador( primeiraLinha ){
    return ( primeiraLinha.split( ";" ).length >= primeiraLinha.split( "," ).length )
        ? ";"
        : ","
}

/**
 * Transforma o .csv no formato String para a versão JSON do xlsx
 * @param   { String } rawBody String do .csv
 * @returns { Promisse< Array<object> > } Versão JSON do .csv
 */
export default async( rawBody = "" ) => {
    let linhas = rawBody.split( "\r\n" ),
        separador = await obter_separador( linhas[0] ),
        headers = await obter_headers( linhas[0], separador )

    return linhas
        // Pula linha dos headers
        .filter(( linha, index ) => index > 0 )
        // Mapeia os valores das células para os headers
        .map( linha => {
            let campos = {}
            linha.split( separador ).forEach(( célula, index ) =>
                campos[ headers[index] ] = célula
            )
            return campos
        })
}