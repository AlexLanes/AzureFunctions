"use strict"

// Dependências
import CsvToJson from "../util/csvToJson.js"
import { app } from "@azure/functions"
import Xlsx from "xlsx"

// Constantes
const MIME_TYPE = "text/csv",
      MILISSEGUNDOS = () => new Date().getTime()

// Rota
app.http( 'converter', {
    methods: [ 'POST' ],
    authLevel: 'anonymous',
    route: "converter/csv-xslx",
    handler: async( request, context ) => {
        // content-type inválido
        if( request.headers.get("content-type") !== MIME_TYPE ) 
            return {
                status: 400,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    código: 400,
                    mensagem: `Esperado Content-Type: ${MIME_TYPE}`
                })
            }

        // monta a planilha com os dados e adiciona no arquivo
        let body = await request.text(),
            dados = await CsvToJson( body ),
            planilha = Xlsx.utils.json_to_sheet( dados ),
            arquivo = Xlsx.utils.book_new()
        Xlsx.utils.book_append_sheet( arquivo, planilha, "planilha" )
    
        // nome e buffer do arquivo
        let nomeArquivo = `${MILISSEGUNDOS()}.xlsx`
        arquivo = Xlsx.write( arquivo, {bookType: "xlsx", type: "buffer"} )
        
        return { 
            status: 200,
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": `attachment; filename=${ nomeArquivo }`
            },
            body: arquivo
        }
    }
})