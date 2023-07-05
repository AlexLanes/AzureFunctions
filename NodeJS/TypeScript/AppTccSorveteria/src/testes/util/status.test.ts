import Assert from "assert"
import { describe, it } from "node:test"
import Mensagens from "../../util/mensagens.js"
import { status_mensagem } from "../../util/status.js"

describe( "Teste status_mensagem", () => {
    it( "tipo da imagem", () => Assert.strictEqual(status_mensagem(Mensagens.imagem.erro.mimeType("")), 400) )
    it( "encontrada", () => Assert.strictEqual(status_mensagem(Mensagens.imagem.erro.não_encontrada), 404) )
    it( "encontrado", () => Assert.strictEqual(status_mensagem(Mensagens.global.erro.não_encontrado), 404) )
    it( "existente", () => Assert.strictEqual(status_mensagem(Mensagens.global.erro.duplicado), 409) )
    it( "Erro interno", () => Assert.strictEqual(status_mensagem(Mensagens.global.erro.interno(new Error(""))), 500) )
})