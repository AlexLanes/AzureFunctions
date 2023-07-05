import Assert from "assert"
import { describe, it } from "node:test"
import Mensagens from "../../util/mensagens.js"
import * as ST from "../../firebase/storage.js"
import { Imagem } from "../../classes/imagem.js"

const NOME = "teste",
      IMAGEM = new Imagem({ nome: "chocolate.jpeg", url_imagem: "https://firebasestorage.googleapis.com/v0/b/apptccsorveteria.appspot.com/o/sorvetes%2Fchocolate.jpeg?alt=media&token=daef8664-b485-4c14-8fa7-ee1e77258a35" }),
      ERRO_OBTER = await ST.obter( NOME ),
      UPLOAD = await ST.upload( NOME, new ArrayBuffer(1), "image/jpeg", "chocolate.jpeg" ),
      ERRO_UPLOAD = await ST.upload( NOME, new ArrayBuffer(1), "errado", "chocolate.jpeg" ),
      OBTER = await ST.obter( NOME ),
      APAGAR = await ST.apagar( NOME, "chocolate.jpeg" ),
      ERRO_APAGAR = await ST.apagar( NOME, "chocolate.jpeg" )

describe( "Teste Storage.obter() nao_encontrado", () => {
    it( "Sucesso", () => Assert.strictEqual(ERRO_OBTER.getSucesso, false) )
    it( "Mensagem", () => Assert.strictEqual(ERRO_OBTER.getMensagem, Mensagens.imagem.erro.não_encontrada) )
    it( "Resultados", () => Assert.deepStrictEqual(ERRO_OBTER.getResultados, []) )
})

describe( "Teste Storage.upload()", () => {
    it( "Sucesso", () => Assert.strictEqual(UPLOAD.getSucesso, true) )
    it( "Mensagem", () => Assert.strictEqual(UPLOAD.getMensagem, Mensagens.imagem.sucesso.upload) )
    it( "Resultados", () => Assert.ok(UPLOAD.getResultados[0] instanceof Imagem) )
})

describe( "Teste Storage.upload() tipo errado", () => {
    it( "Sucesso", () => Assert.strictEqual(ERRO_UPLOAD.getSucesso, false) )
    it( "Mensagem", () => Assert.strictEqual(ERRO_UPLOAD.getMensagem, Mensagens.imagem.erro.mimeType("errado")) )
    it( "Resultados", () => Assert.deepStrictEqual(ERRO_UPLOAD.getResultados, []) )
})

describe( "Teste Storage.obter()", () => {
    it( "Sucesso", () => Assert.strictEqual(OBTER.getSucesso, true) )
    it( "Mensagem", () => Assert.strictEqual(OBTER.getMensagem, Mensagens.imagem.sucesso.obter(1)) )
    it( "Resultados", () => Assert.ok(OBTER.getResultados[0] instanceof Imagem) )
})

describe( "Teste Storage.apagar()", () => {
    it( "Sucesso", () => Assert.strictEqual(APAGAR.getSucesso, true) )
    it( "Mensagem", () => Assert.strictEqual(APAGAR.getMensagem, Mensagens.imagem.sucesso.apagar) )
    it( "Resultados", () => Assert.deepStrictEqual(APAGAR.getResultados, []) )
})

describe( "Teste Storage.apagar() nao_encontrado", () => {
    it( "Sucesso", () => Assert.strictEqual(ERRO_APAGAR.getSucesso, false) )
    it( "Mensagem", () => Assert.strictEqual(ERRO_APAGAR.getMensagem, Mensagens.imagem.erro.não_encontrada) )
    it( "Resultados", () => Assert.deepStrictEqual(ERRO_APAGAR.getResultados, []) )
})