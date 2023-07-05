import Assert from "assert"
import { describe, it } from "node:test"
import * as Funções from "../../util/funções.js"

describe( "Teste do isNullEmptyUndefined", () => {
    it( "Null", () => Assert.ok(Funções.isNullEmptyUndefined(null)) )
    it( "Empty", () => Assert.ok(Funções.isNullEmptyUndefined("")) )
    it( "Undefined1", () => Assert.ok(Funções.isNullEmptyUndefined()) )
    it( "Undefined2", () => Assert.ok(Funções.isNullEmptyUndefined(undefined)) )
    it( "Correto", () => Assert.ok(!Funções.isNullEmptyUndefined("string")) )
})

describe( "Teste do remover_acento", () => {
    it( "Vogais lower case", () => Assert.strictEqual(Funções.remover_acento("áàéèíìóòúùãõâêô"), "aaeeiioouuaoaeo") )
    it( "Vogais upper case", () => Assert.strictEqual(Funções.remover_acento("ÁÀÉÈÍÌÓÒÚÙÃÕÂÊÔ"), "AAEEIIOOUUAOAEO") )
    it( "Cedilha", () => Assert.strictEqual(Funções.remover_acento("çÇ"), "cC") )
})

describe( "Teste do normalizar", () => {
    it( "Trim e lower case", () => Assert.strictEqual(Funções.normalizar("   TESTE   "), "teste") )
    it( "Acentuacao", () => Assert.strictEqual(Funções.normalizar("áâãçÁÀÃÇ"), "aaacaaac") )
    it( "Espacos por underline", () => Assert.strictEqual(Funções.normalizar("teste de    espaço"), "teste_de_espaco") )
})