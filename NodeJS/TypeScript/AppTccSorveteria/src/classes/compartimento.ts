import { isNullEmptyUndefined, normalizar } from "../util/funções.js"
import { DocumentoFireBase } from "./documentoFireBase.js"

export interface ICompartimento {
	/**
	 * Metadata do id do documento na coleção.
	 * Não suporta alteração
	 */
	_id?: string

	/**
	 * Tipo do compartimento
	 */ 
	readonly tipo: string

	/**
	 * Capacidade em ml do compartimento
	 */ 
	readonly capacidade: number

	/**
	 * Preço do compartimento
	 */ 
	readonly preco: number

	/**
	 * Quantidade de adicionais do compartimento
	 */ 
	readonly qtd_adicionais: number

	/**
	 * Quantidade de sabores do compartimento
	 */ 
	readonly qtd_sabores: number

	/**
	 * Flag do estoque
	 */
	readonly estoque: boolean

	/**
	 * Url da imagem no Firebase Storage
	 */
	readonly url_imagem: string
}

export class Compartimento extends DocumentoFireBase {
	private tipo: string
    private capacidade: number
    private preco: number
    private qtd_adicionais: number
    private qtd_sabores: number
    private estoque: boolean
    private url_imagem: string

	/**
	 * Classe da collection dos compartimento
	 */
	constructor( compartimento: ICompartimento ){
		let id = isNullEmptyUndefined( compartimento?._id ) 
			? normalizar( `${compartimento.tipo} ${compartimento.capacidade}` ) 
			: compartimento._id
		super( id )

		this.tipo = compartimento.tipo
		this.capacidade = compartimento.capacidade
		this.preco = compartimento.preco
		this.qtd_adicionais = compartimento.qtd_adicionais
		this.qtd_sabores = compartimento.qtd_sabores
		this.estoque = compartimento.estoque
		this.url_imagem = compartimento.url_imagem
	}
}