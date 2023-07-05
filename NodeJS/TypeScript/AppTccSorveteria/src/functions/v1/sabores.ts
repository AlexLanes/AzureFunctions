// Dependências
import { app as App, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions"
import { Sabor, ISabor } from "../../classes/sabor.js"
import { status_mensagem } from "../../util/status.js"
import { Resultado } from "../../classes/resultado.js"
import * as DB from "../../firebase/database.js"
import * as ST from "../../firebase/storage.js"
import Mensagens from "../../util/mensagens.js"

const NOME_COLLECTION = "sabores"

/**
 * Rotas dos Sabores
 */

App.http( "obter-sabor", {
    methods: [ "GET" ],
    authLevel: "function",
    route: "v1/sabores/{id}",
    handler: async( request: HttpRequest, context: InvocationContext ): Promise< HttpResponseInit > => {
        let { id } = request.params,
            resultado = await DB.obter_id< Sabor >( NOME_COLLECTION, id )

        return {
            status: ( resultado.getSucesso )
                ? 200
                : status_mensagem( resultado.getMensagem ),

            jsonBody: resultado
        }
    }
})

App.http( "obter-sabores", {
    methods: [ "GET" ],
    authLevel: "function",
    route: "v1/sabores",
    handler: async( request: HttpRequest, context: InvocationContext ): Promise< HttpResponseInit > => {
        let tipo = request.query.get( "tipo" ),
            resultado = await DB.obter< Sabor >( NOME_COLLECTION, tipo ? [tipo] : [] )

        return {
            status: ( resultado.getSucesso )
                ? 200
                : status_mensagem( resultado.getMensagem ),

            jsonBody: resultado
        }
    }
})

App.http( "criar-sabor", {
    methods: [ "POST" ],
    authLevel: "function",
    route: "v1/sabores",
    handler: async( request: HttpRequest, context: InvocationContext ): Promise< HttpResponseInit > => {
        let sabor = await request.json() as ISabor,
            resultado = await DB.criar< Sabor >( NOME_COLLECTION, new Sabor(sabor) )

        return {
            status: ( resultado.getSucesso )
                ? 201
                : status_mensagem( resultado.getMensagem ),

            jsonBody: resultado
        }
    }
})

App.http( "atualizar-sabor", {
    methods: [ "PUT" ],
    authLevel: "function",
    route: "v1/sabores/{id}",
    handler: async( request: HttpRequest, context: InvocationContext ): Promise< HttpResponseInit > => {
        let sabor = { 
                _id: request.params.id, 
                ...await request.json() as Object 
            } as ISabor,
            resultado = await DB.atualizar< Sabor >( NOME_COLLECTION, new Sabor(sabor) )

        return {
            status: ( resultado.getSucesso )
                ? 200
                : status_mensagem( resultado.getMensagem ),

            jsonBody: resultado
        }
    }
})

App.http( "apagar-sabor", {
    methods: [ "DELETE" ],
    authLevel: "function",
    route: "v1/sabores/{id}",
    handler: async( request: HttpRequest, context: InvocationContext ): Promise< HttpResponseInit > => {
        let { id } = request.params,
            resultado = await DB.apagar< Sabor >( NOME_COLLECTION, id )

        return {
            status: ( resultado.getSucesso )
                ? 200
                : status_mensagem( resultado.getMensagem ),

            jsonBody: resultado
        }
    }
})

App.http( "obter-imagens-sabor", {
    methods: [ "GET" ],
    authLevel: "function",
    route: "v1/sabores/imagens",
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

App.http( "upload-imagem-sabor", {
    methods: [ "POST" ],
    authLevel: "function",
    route: "v1/sabores/imagens",
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

App.http( "apagar-imagem-sabor", {
    methods: [ "DELETE" ],
    authLevel: "function",
    route: "v1/sabores/imagens/{nome}",
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