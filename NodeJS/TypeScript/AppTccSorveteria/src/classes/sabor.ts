import { isNullEmptyUndefined, normalizar } from "../util/funções.js"
import { DocumentoFireBase } from "./documentoFireBase.js"

export interface ISabor {
	/**
	 * Metadata do id do documento na coleção.
	 * Não suporta alteração
	 */
	_id?: string

	/**
	 * Nome do sabor
	 */ 
	readonly nome: string

	/**
	 * Nome do sabor
	 */ 
	readonly tipo: string

	/**
	 * Flag do estoque
	 */
	readonly estoque: boolean

	/**
	 * Url da imagem no Firebase Storage
	 */
	readonly url_imagem: string
}

export class Sabor extends DocumentoFireBase {
    private nome: string
    private tipo: string
    private estoque: boolean
    private url_imagem: string

	/**
	 * Classe da collection dos Sabores
	 */
	constructor( sabor: ISabor ){
		let id = isNullEmptyUndefined( sabor?._id ) 
			? normalizar( `${sabor.tipo} ${sabor.nome}` ) 
			: sabor._id
		super( id )

		this.nome = sabor.nome
		this.tipo = sabor.tipo
		this.estoque = sabor.estoque
		this.url_imagem = sabor.url_imagem
	}
}