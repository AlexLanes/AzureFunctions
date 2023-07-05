import Assert from "assert"
import { describe, it } from "node:test"
import { Resultado } from "../../classes/resultado.js"

describe( "Teste da classe Resultado vazia", () => {
    let resultado = new Resultado()

    it( "sucesso", () => Assert.strictEqual(resultado.getSucesso, true) )
    it( "mensagem", () => Assert.strictEqual(resultado.getMensagem, "") )
    it( "resultados", () => Assert.deepStrictEqual(resultado.getResultados, []) )
})

describe( "Teste da classe Resultado inicializada", () => {
    let resultado = new Resultado< string >({ 
        sucesso: false, 
        mensagem: "Mensagem de Teste", 
        resultados: ["a", "b"]
    })

    it( "sucesso", () => Assert.strictEqual(resultado.getSucesso, false) )
    it( "mensagem", () => Assert.strictEqual(resultado.getMensagem, "Mensagem de Teste") )
    it( "resultados", () => Assert.deepStrictEqual(resultado.getResultados, ["a", "b"]) )
})

describe( "Teste da classe Resultado setters e funcoes", () => {
    let resultado = new Resultado< number >()
        .setSucesso( false )
        .setMensagem( "Mensagem de Teste" )
        .setResultados([ 1 ])

    it( "setSucesso", () => Assert.strictEqual(resultado.getSucesso, false) )
    it( "setMensagem", () => Assert.strictEqual(resultado.getMensagem, "Mensagem de Teste") )
    it( "setResultados", () => Assert.deepStrictEqual(resultado.getResultados, [1]) )
    it( "length", () => Assert.strictEqual(resultado.length, 1) )
    it( "push", () => Assert.strictEqual(resultado.push(2).length, 2) )
})