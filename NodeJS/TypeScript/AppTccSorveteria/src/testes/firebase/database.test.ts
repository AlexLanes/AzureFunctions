import Assert from "assert"
import { describe, it } from "node:test"
import Mensagens from "../../util/mensagens.js"
import * as DB from "../../firebase/database.js"
import { Sabor } from "../../classes/sabor.js"

const NOME = "teste",
      SABOR = new Sabor({ nome: "Teste", tipo: "sorvete", estoque: false, url_imagem: "url" }),
      ERRO_OBTER = await DB.obter< Sabor >( NOME, [] ),
      ERRO_OBTER_ID = await DB.obter_id< Sabor >( NOME, "id" ),
      CRIAR = await DB.criar< Sabor >( NOME, SABOR ),
      ERRO_CRIAR = await DB.criar< Sabor >( NOME, SABOR ),
      OBTER = await DB.obter< Sabor >( NOME, [] ),
      OBTER_ID = await DB.obter_id< Sabor >( NOME, SABOR.getId ),
      ATUALIZAR = await DB.atualizar< Sabor >( NOME, SABOR ),
      APAGAR = await DB.apagar< Sabor >( NOME, "sorvete_teste" ),
      ERRO_APAGAR = await DB.apagar< Sabor >( NOME, "sorvete_teste" ),
      ERRO_ATUALIZAR = await DB.atualizar< Sabor >( NOME, SABOR )

describe( "Teste Database.obter() nao_encontrado", () => {
    it( "Sucesso", () => Assert.strictEqual(ERRO_OBTER.getSucesso, false) )
    it( "Mensagem", () => Assert.strictEqual(ERRO_OBTER.getMensagem, Mensagens.global.erro.não_encontrado) )
    it( "Resultados", () => Assert.deepStrictEqual(ERRO_OBTER.getResultados, []) )
})

describe( "Teste Database.obter_id() nao_encontrado", () => {
    it( "Sucesso", () => Assert.strictEqual(ERRO_OBTER_ID.getSucesso, false) )
    it( "Mensagem", () => Assert.strictEqual(ERRO_OBTER_ID.getMensagem, Mensagens.global.erro.não_encontrado) )
    it( "Resultados", () => Assert.deepStrictEqual(ERRO_OBTER_ID.getResultados, []) )
})

describe( "Teste Database.criar()", () => {
    it( "Sucesso", () => Assert.strictEqual(CRIAR.getSucesso, true) )
    it( "Mensagem", () => Assert.strictEqual(CRIAR.getMensagem, Mensagens.global.sucesso.criar) )
    it( "Resultados", () => Assert.deepStrictEqual(CRIAR.getResultados[0], SABOR) )
})

describe( "Teste Database.criar() duplicado", () => {
    it( "Sucesso", () => Assert.strictEqual(ERRO_CRIAR.getSucesso, false) )
    it( "Mensagem", () => Assert.strictEqual(ERRO_CRIAR.getMensagem, Mensagens.global.erro.duplicado) )
    it( "Resultados", () => Assert.deepStrictEqual(ERRO_CRIAR.getResultados, []) )
})

describe( "Teste Database.obter()", () => {
    it( "Sucesso", () => Assert.strictEqual(OBTER.getSucesso, true) )
    it( "Mensagem", () => Assert.strictEqual(OBTER.getMensagem, Mensagens.global.sucesso.obter(1)) )
    it( "Resultados", () => Assert.deepStrictEqual({...OBTER.getResultados[0]}, {...SABOR}) )
})

describe( "Teste Database.obter_id()", () => {
    it( "Sucesso", () => Assert.strictEqual(OBTER_ID.getSucesso, true) )
    it( "Mensagem", () => Assert.strictEqual(OBTER_ID.getMensagem, Mensagens.global.sucesso.obter(1)) )
    it( "Resultados", () => Assert.deepStrictEqual({...OBTER_ID.getResultados[0]}, {...SABOR}) )
})

describe( "Teste Database.atualizar()", () => {
    it( "Sucesso", () => Assert.strictEqual(ATUALIZAR.getSucesso, true) )
    it( "Mensagem", () => Assert.strictEqual(ATUALIZAR.getMensagem, Mensagens.global.sucesso.atualizar) )
    it( "Resultados", () => Assert.deepStrictEqual(ATUALIZAR.getResultados[0], SABOR) )
})

describe( "Teste Database.apagar()", () => {
    it( "Sucesso", () => Assert.strictEqual(APAGAR.getSucesso, true) )
    it( "Mensagem", () => Assert.strictEqual(APAGAR.getMensagem, Mensagens.global.sucesso.apagar) )
    it( "Resultados", () => Assert.deepStrictEqual(APAGAR.getResultados, []) )
})

describe( "Teste Database.atualizar() nao_encontrado", () => {
    it( "Sucesso", () => Assert.strictEqual(ERRO_ATUALIZAR.getSucesso, false) )
    it( "Mensagem", () => Assert.strictEqual(ERRO_ATUALIZAR.getMensagem, Mensagens.global.erro.não_encontrado) )
    it( "Resultados", () => Assert.deepStrictEqual(ERRO_ATUALIZAR.getResultados, []) )
})

describe( "Teste Database.apagar() nao_encontrado", () => {
    it( "Sucesso", () => Assert.strictEqual(ERRO_APAGAR.getSucesso, false) )
    it( "Mensagem", () => Assert.strictEqual(ERRO_APAGAR.getMensagem, Mensagens.global.erro.não_encontrado) )
    it( "Resultados", () => Assert.deepStrictEqual(ERRO_APAGAR.getResultados, []) )
})