import Assert from "assert"
import { describe, it } from "node:test"
import { Sabor } from "../../classes/sabor.js"

let sabor = { nome: "Chocolate Suiço", tipo: "sorvete", estoque: true, url_imagem: "https://firebasestorage.googleapis.com/v0/b/apptccsorveteria.appspot.com/o/sorvetes%2Fchocolate.jpeg?alt=media&token=daef8664-b485-4c14-8fa7-ee1e77258a35" },
    sabor_id = { _id: "abc123", ...sabor }

describe( "Teste da classe Sabor sem o _id", () => {
    let classe_sabor = new Sabor( sabor ),
        documento = classe_sabor.getDocumento

    it( "_id", () => Assert.strictEqual(classe_sabor.getId, "sorvete_chocolate_suico") )
    it( "nome", () => Assert.strictEqual(documento["nome"], "Chocolate Suiço") )
    it( "tipo", () => Assert.strictEqual(documento["tipo"], "sorvete") )
    it( "estoque", () => Assert.strictEqual(documento["estoque"], true) )
    it( "url_imagem", () => Assert.strictEqual(documento["url_imagem"], "https://firebasestorage.googleapis.com/v0/b/apptccsorveteria.appspot.com/o/sorvetes%2Fchocolate.jpeg?alt=media&token=daef8664-b485-4c14-8fa7-ee1e77258a35") )
    it( "documento", () => Assert.deepStrictEqual(sabor, documento) )
})

describe( "Teste da classe Sabor com o _id", () => {
    let classe_sorvete = new Sabor( sabor_id ),
        documento = classe_sorvete.getDocumento

    it( "_id", () => Assert.strictEqual(classe_sorvete.getId, "abc123") )
    it( "nome", () => Assert.strictEqual(documento["nome"], "Chocolate Suiço") )
    it( "tipo", () => Assert.strictEqual(documento["tipo"], "sorvete") )
    it( "estoque", () => Assert.strictEqual(documento["estoque"], true) )
    it( "url_imagem", () => Assert.strictEqual(documento["url_imagem"], "https://firebasestorage.googleapis.com/v0/b/apptccsorveteria.appspot.com/o/sorvetes%2Fchocolate.jpeg?alt=media&token=daef8664-b485-4c14-8fa7-ee1e77258a35") )
    it( "documento", () => Assert.deepStrictEqual(sabor, documento) )
})