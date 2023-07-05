export interface IResultado< T > {
	/**
	 * Flag se a mensagem foi bem sucedida ou não
	 * @default true
	 */
    readonly sucesso?: boolean
	
	/**
	 * Texto sobre o resultado obtido
	 * @default ""
	 */
    readonly mensagem?: string

	/**
	 * Itens de resposta, caso haja
	 * @default []
	 */
    readonly resultados?: Array< T >
}

export class Resultado< T > {
    private sucesso?: boolean
    private mensagem?: string
    private resultados?: Array< T >
    
	/**
	 * Classe resultado padrão para resposta da API e do Firebase
	 */
	constructor( Resultado?: IResultado<any> ){
		this.sucesso = Resultado?.sucesso ?? true
		this.mensagem = Resultado?.mensagem ?? ""
		this.resultados = Resultado?.resultados ?? []
	}

	/**
	 * Getter sucesso
	 */
	get getSucesso(){
		return this.sucesso
	}

	/**
	 * Setter sucesso
	 */
	setSucesso( sucesso: boolean ){
		this.sucesso = sucesso
		return this
	}

	/**
	 * Getter mensagem
	 */
	get getMensagem(){
		return this.mensagem
	}

	/**
	 * Setter mensagem
	 */
	setMensagem( mensagem: string ){
		this.mensagem = mensagem
		return this
	}

	/**
	 * Getter resultados
	 */
	get getResultados(){
		return this.resultados
	}

	/**
	 * Setter resultados
	 */
	setResultados( resultados: Array<T> ){
		this.resultados = resultados
		return this
	}

	/**
	 * Adicionar um item no Resultado.resultados
	 */
	push( item: T ){
		this.resultados.push( item )
		return this
	}

	/**
	 * Length do Resultado.resultados
	 */
	get length(){
		return this.resultados.length
	}
}