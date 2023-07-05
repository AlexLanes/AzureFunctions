// Dependências
import { 
    getFirestore, collection, getDoc, setDoc, deleteDoc, 
    QueryDocumentSnapshot, getDocs, DocumentData, doc
} from "firebase/firestore/lite"
import { DocumentoFireBase } from "../classes/documentoFireBase.js"
import { isNullEmptyUndefined } from "../util/funções.js"
import { Resultado } from "../classes/resultado.js"
import Mensagens from "../util/mensagens.js"
import App from "./app.js"

export const DB = getFirestore( App )
      
/**
 * Obter todos os documentos da Collection
 */
export async function obter< T extends DocumentoFireBase >( nome_collection: string, tipo: Array<string> ): Promise< Resultado<T> > {
    let resultado = new Resultado< T >(),
        collectionReference = collection( DB, nome_collection )

    try {
        // Obter todos os documentos da collection
		let documentos = await getDocs( collectionReference )

        // Percorrer todos os documentos, montar um item e adicionar no Resultado
		documentos.docs.forEach(( documento: QueryDocumentSnapshot<DocumentData> ) => {
            let item = {
                _id: documento.id,
                ...documento.data()
            } as unknown as T
            
            if( tipo.length === 0 || tipo.includes(item["tipo"]) )
                resultado.push( item )
        })
        
        // Retornar sucesso
        if( resultado.length >= 1 ) resultado
            .setMensagem( Mensagens.global.sucesso.obter(resultado.length) )
        // Retornar erro
        else resultado.setSucesso( false )
                      .setMensagem( Mensagens.global.erro.não_encontrado )
                      .setResultados( [] )

	} catch( erro ){
		resultado.setSucesso( false )
                 .setMensagem( Mensagens.global.erro.interno(erro) )
                 .setResultados( [] )
        
	} finally {
        return resultado
    }
}

/**
 * Obter documento da Collection pelo id
 */
export async function obter_id< T extends DocumentoFireBase >( nome_collection: string, _id?: string ): Promise< Resultado<T> > {
    let resultado = new Resultado< T >(),
        collectionReference = collection( DB, nome_collection ) 
    
    // _id não pode ser vazio, se não erro ocorre ao tentar usar a função getDoc()
    if( isNullEmptyUndefined(_id) ) 
        _id = "11"
    
    try {
        // Obter o documento
        let documentReference = doc( collectionReference, _id ),
            documento = await getDoc( documentReference )

        // Encontrado na Collection
        if( documento.exists() ){
            let item = {
                _id: documento.id,
                ...documento.data()
            } as unknown as T

            resultado.push( item ) 
                     .setMensagem( Mensagens.global.sucesso.obter(1) )
        
        // Não encontrado
        } else resultado.setSucesso( false )
                        .setMensagem( Mensagens.global.erro.não_encontrado )
                        .setResultados( [] )

    } catch( erro ){
		resultado.setSucesso( false )
                 .setMensagem( Mensagens.global.erro.interno(erro) )
                 .setResultados( [] )

    } finally {
        return resultado
    }
}

/**
 * Criar um documento na collection
 */
export async function criar< T extends DocumentoFireBase >( nome_collection: string, documento: T ): Promise< Resultado<T> > {
    let resultado = await obter_id< T >( nome_collection, documento.getId ),
        collectionReference = collection( DB, nome_collection )

    // Nome duplicado no banco de dados
    if( resultado.getSucesso ) return resultado
        .setSucesso( false )
        .setMensagem( Mensagens.global.erro.duplicado )
        .setResultados( [] )
    
    try {
        // Validado com Sucesso, inserir no database
        let documentReference = doc( collectionReference, documento.getId )
        await setDoc( documentReference, documento.getDocumento )

        // Retornar Sucesso
        resultado.setSucesso( true )
                 .setMensagem( Mensagens.global.sucesso.criar )
                 .setResultados([ documento ])

	} catch( erro ){
		resultado.setSucesso( false )
                 .setMensagem( Mensagens.global.erro.interno(erro) )
                 .setResultados( [] )

    } finally {
        return resultado
    }
}

/**
 * Apagar um documento na Collection
 */
export async function apagar< T extends DocumentoFireBase >( nome_collection: string, id: DocumentoFireBase["_id"] ): Promise< Resultado<T> > {
    let resultado = await obter_id< T >( nome_collection, id ),
        collectionReference = collection( DB, nome_collection )
    
    // Validação se o id existe
    if( !resultado.getSucesso ) 
        return resultado
    
    try {
        // Apagar da Collection
		let documentReference = doc( collectionReference, id )
        await deleteDoc( documentReference )
        
        // Retornar Sucesso
        resultado.setSucesso( true )
                 .setMensagem( Mensagens.global.sucesso.apagar )
                 .setResultados( [] )

	} catch( erro ){
		resultado.setSucesso( false )
                 .setMensagem( Mensagens.global.erro.interno(erro) )
                 .setResultados( [] )
	
    } finally {
        return resultado
    }
}

/**
 * Atualizar um documento na Collection. 
 * Não suporta atualização do _id
 */
export async function atualizar< T extends DocumentoFireBase >( nome_collection: string, documento: T ): Promise< Resultado<T> > {
    let resultado = await obter_id< T >( nome_collection, documento.getId ),
        collectionReference = collection( DB, nome_collection )
    
    // Validação se o id foi encontrado
    if( !resultado.getSucesso ) 
        return resultado
    
    try {
        // Atualizar
		let documentReference = doc( collectionReference, documento.getId )
        await setDoc( documentReference, documento.getDocumento )
        
        // Retornar sucesso
        resultado.setSucesso( true )
                 .setMensagem( Mensagens.global.sucesso.atualizar )
                 .setResultados([ documento ])

	} catch( erro ){
		resultado.setSucesso( false )
                 .setMensagem( Mensagens.global.erro.interno(erro) )
                 .setResultados( [] )
	
    } finally {
        return resultado
    }
}