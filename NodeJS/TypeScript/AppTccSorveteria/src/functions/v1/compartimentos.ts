// Dependências
import { app as App, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions"
import { Compartimento, ICompartimento } from "../../classes/compartimento.js"
import { status_mensagem } from "../../util/status.js"
import { Resultado } from "../../classes/resultado.js"
import * as DB from "../../firebase/database.js"
import * as ST from "../../firebase/storage.js"
import Mensagens from "../../util/mensagens.js"

const NOME_COLLECTION = "compartimentos"

/**
 * Rotas dos Compartimentos
 */

App.http( "obter-compartimento", {
    methods: [ "GET" ],
    authLevel: "function",
    route: "v1/compartimentos/{id}",
    handler: async( request: HttpRequest, context: InvocationContext ): Promise< HttpResponseInit > => {
        let { id } = request.params,
            resultado = await DB.obter_id< Compartimento >( NOME_COLLECTION, id )

        return {
            status: ( resultado.getSucesso )
                ? 200
                : status_mensagem( resultado.getMensagem ),

            jsonBody: resultado
        }
    }
})

App.http( "obter-compartimentos", {
    methods: [ "GET" ],
    authLevel: "function",
    route: "v1/compartimentos",
    handler: async( request: HttpRequest, context: InvocationContext ): Promise< HttpResponseInit > => {
        let tipo = request.query.get( "tipo" ),
            resultado = await DB.obter< Compartimento >( NOME_COLLECTION, tipo ? tipo.split(",") : [] )

        return {
            status: ( resultado.getSucesso )
                ? 200
                : status_mensagem( resultado.getMensagem ),

            jsonBody: resultado
        }
    }
})

App.http( "criar-compartimento", {
    methods: [ "POST" ],
    authLevel: "function",
    route: "v1/compartimentos",
    handler: async( request: HttpRequest, context: InvocationContext ): Promise< HttpResponseInit > => {
        let compartimento = await request.json() as ICompartimento,
            resultado = await DB.criar< Compartimento >( NOME_COLLECTION, new Compartimento(compartimento) )

        return {
            status: ( resultado.getSucesso )
                ? 201
                : status_mensagem( resultado.getMensagem ),

            jsonBody: resultado
        }
    }
})

App.http( "atualizar-compartimento", {
    methods: [ "PUT" ],
    authLevel: "function",
    route: "v1/compartimentos/{id}",
    handler: async( request: HttpRequest, context: InvocationContext ): Promise< HttpResponseInit > => {
        let compartimento = { 
                _id: request.params.id, 
                ...await request.json() as Object 
            } as ICompartimento,
            resultado = await DB.atualizar< Compartimento >( NOME_COLLECTION, new Compartimento(compartimento) )

        return {
            status: ( resultado.getSucesso )
                ? 200
                : status_mensagem( resultado.getMensagem ),

            jsonBody: resultado
        }
    }
})

App.http( "apagar-compartimento", {
    methods: [ "DELETE" ],
    authLevel: "function",
    route: "v1/compartimentos/{id}",
    handler: async( request: HttpRequest, context: InvocationContext ): Promise< HttpResponseInit > => {
        let { id } = request.params,
            resultado = await DB.apagar< Compartimento >( NOME_COLLECTION, id )

        return {
            status: ( resultado.getSucesso )
                ? 200
                : status_mensagem( resultado.getMensagem ),

            jsonBody: resultado
        }
    }
})

App.http( "obter-imagens-compartimento", {
    methods: [ "GET" ],
    authLevel: "function",
    route: "v1/compartimentos/imagens",
    handler: async( request: HttpRequest, context: InvocationContext ): Promise< HttpResponseInit > => {
        let resultado = await ST.obter( NOME_COLLECTION )

        return {
            status: ( resultado.getSucesso )
                ? 200
                : status_mensagem( resultado.getMensagem ),

            jsonBody: resultado
        }
    }
})

App.http( "upload-imagem-compartimento", {
    methods: [ "POST" ],
    authLevel: "function",
    route: "v1/compartimentos/imagens",
    handler: async( request: HttpRequest, context: InvocationContext ): Promise< HttpResponseInit > => {
        let form = await request.formData()
        
        // Validação se a imagem foi informada
        if( !form.has("imagem") || !(form.get("imagem") instanceof Blob) )
            return {
                status: 400,
                
                jsonBody: new Resultado({ sucesso: false, mensagem: Mensagens.imagem.erro.não_informada })
            }

        let file = form.get( "imagem" ) as unknown as File, 
            { type: tipo, name: nomeArquivo } = file,
            nome = form?.get( "nome" )?.toString() ?? nomeArquivo,
            imagem = await file.arrayBuffer(), 
            resultado = await ST.upload( NOME_COLLECTION, imagem, tipo, nome )
        
        return {
            status: ( resultado.getSucesso )
                ? 201
                : status_mensagem( resultado.getMensagem ),

            jsonBody: resultado
        }
    }
})

App.http( "apagar-imagem-compartimento", {
    methods: [ "DELETE" ],
    authLevel: "function",
    route: "v1/compartimentos/imagens/{nome}",
    handler: async( request: HttpRequest, context: InvocationContext ): Promise< HttpResponseInit > => {
        let { nome } = request.params, 
            resultado = await ST.apagar( NOME_COLLECTION, nome )

        return {
            status: ( resultado.getSucesso )
                ? 200
                : status_mensagem( resultado.getMensagem ),

            jsonBody: resultado
        }
    }
})