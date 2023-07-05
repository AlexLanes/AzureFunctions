import Assert from "assert"
import { describe, it } from "node:test"
import { Imagem } from "../../classes/imagem.js"

describe( "Teste da classe imagem", () => {
    let imagem = { 
        nome: "chocolate.jpeg", 
        url_imagem: "https://firebasestorage.googleapis.com/v0/b/apptccsorveteria.appspot.com/o/sorvetes%2Fchocolate.jpeg?alt=media&token=daef8664-b485-4c14-8fa7-ee1e77258a35"
    }

    it( "getNome", () => Assert.strictEqual(new Imagem(imagem).getNome, "chocolate.jpeg") )
    it( "getUrl", () => Assert.strictEqual(new Imagem(imagem).getUrl, "https://firebasestorage.googleapis.com/v0/b/apptccsorveteria.appspot.com/o/sorvetes%2Fchocolate.jpeg?alt=media&token=daef8664-b485-4c14-8fa7-ee1e77258a35") )
})