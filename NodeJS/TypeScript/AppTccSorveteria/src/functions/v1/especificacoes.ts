// Dependências
import { app as App, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions"
import { readFileSync as ler_arquivo } from "node:fs"

/**
 * Rotas das Especificações
 */

App.http( "especificacao-sabores", {
    methods: [ "GET" ],
    authLevel: "function",
    route: "v1/especificacoes/sabores",
    handler: async( request: HttpRequest, context: InvocationContext ): Promise< HttpResponseInit > => {
        let caminho = `${ process.cwd() }\\especificacoes\\sabores.json`
        
        return {
            status: 200,

            jsonBody: JSON.parse( ler_arquivo(caminho, "utf8") )
        }
    }
})

App.http( "especificacao-compartimentos", {
    methods: [ "GET" ],
    authLevel: "function",
    route: "v1/especificacoes/compartimentos",
    handler: async( request: HttpRequest, context: InvocationContext ): Promise< HttpResponseInit > => {
        let caminho = `${ process.cwd() }\\especificacoes\\compartimentos.json`

        return {
            status: 200,

            jsonBody: JSON.parse( ler_arquivo(caminho, "utf8") )
        }
    }
})