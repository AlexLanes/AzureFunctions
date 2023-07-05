export interface IImagem {
	/**
	 * Nome da imagem
	 */ 
	readonly nome: string

	/**
	 * Url da imagem no Firebase Storage
	 */
	readonly url_imagem: string
}

export class Imagem {
    private nome: string
    private url_imagem: string

    /**
     * Classe das imagen utilizadas 
	 * em request e response
     */
    constructor( imagem: IImagem ){
        this.nome = imagem.nome
        this.url_imagem = imagem.url_imagem
    }
    
    /**
     * Getter nome
     */
    get getNome(){
        return this.nome
    }
    
    /**
     * Getter url_imagem
     */
    get getUrl(){
        return this.url_imagem
    }
}