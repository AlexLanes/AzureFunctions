export abstract class DocumentoFireBase {
	/**
	 * Metadata do id do documento na coleção.
	 * Não suporta alteração
	 */
	private _id?: string

	/**
	 * Construtor do _id
	 */
	constructor( _id: string ){
		this._id = _id
	}

	/**
	 * Getter _id
	 */
	get getId(){
		return this._id
	}

	/**
	 * Retorna os dados no formato de documento.  
	 * Retorna tudo exceto o _id
	 */
	get getDocumento(): object {
		let copy = { ...this }
		delete copy._id
		return copy
	}
}