// Dependências
import { getStorage, ref, listAll, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { Resultado } from "../classes/resultado.js"
import { normalizar } from "../util/funções.js"
import { Imagem } from "../classes/imagem.js"
import Mensagens from "../util/mensagens.js"
import App from "./app.js"

const STORAGE = getStorage( App )

/**
 * Obter as imagens da collection
 */
export async function obter( storage_name: string ): Promise< Resultado<Imagem> > {
    let resultado = new Resultado< Imagem >(),
        storageReference = ref( STORAGE, storage_name )
    
    try {
        // Obter imagens
        let lista = await listAll( storageReference )
        
        for( let item of lista.items ){
            let imagem = new Imagem({
                nome: item.name,
                url_imagem: await getDownloadURL( ref(item.parent, item.name) )
            })

            resultado.push( imagem )
        }

        // Retornar sucesso
        if( resultado.length >= 1 ) resultado
            .setMensagem( Mensagens.imagem.sucesso.obter(resultado.length) )
        // Retornar erro
        else resultado.setSucesso( false )
                      .setMensagem( Mensagens.imagem.erro.não_encontrada )
    
    } catch( erro ){
		resultado.setSucesso( false )
                 .setMensagem( Mensagens.global.erro.interno(erro) )
                 .setResultados( [] )
    
    } finally {
        return resultado
    }
}

/**
 * Upload de imagem na collection
 * @param imagem Dados da imagem
 * @param nome Nome da imagem
 * @param tipo Mime-type da imagem
 */
export async function upload( storage_name: string, imagem: ArrayBuffer, tipo: string, nome: string ): Promise< Resultado<Imagem> > {
    let resultado = new Resultado< Imagem >()

    // Normalizar nome
    nome = normalizar( nome )

    // Não é uma imagem
    if( !tipo.startsWith("image/") ) 
        return resultado.setSucesso( false )
                        .setMensagem( Mensagens.imagem.erro.mimeType(tipo) )
    
    try {
        // Realizar o upload
        let storageReference = ref( STORAGE, `${storage_name}/${nome}` ), 
            upload = await uploadBytes( storageReference, imagem, {
                "contentType": tipo
            })

        // Retornar sucesso
        let _imagem = new Imagem({
            nome: upload.ref.name,
            url_imagem: await getDownloadURL( upload.ref )
        })

        resultado.setMensagem( Mensagens.imagem.sucesso.upload )
                 .setResultados([ _imagem ])
    
    } catch( erro ){
		resultado.setSucesso( false )
                 .setMensagem( Mensagens.global.erro.interno(erro) )
                 .setResultados( [] )
    }

    finally {
        return resultado
    }
}

/**
 * Apagar imagem da collection
 */
export async function apagar( storage_name: string, nome_imagem: Imagem["nome"] ): Promise< Resultado<Imagem> > {
    let resultado = new Resultado< Imagem >(),
        storageReference = ref( STORAGE, `${storage_name}/${nome_imagem}` )

    try {
        // Apagar imagem
        await deleteObject( storageReference )

        // Retornar sucesso
        resultado.setSucesso( true )
                 .setMensagem( Mensagens.imagem.sucesso.apagar )
    
    } catch( erro ){
		resultado.setSucesso( false )
                 .setMensagem(( erro.code === "storage/object-not-found" )
                    ? Mensagens.imagem.erro.não_encontrada
                    : Mensagens.global.erro.interno( erro ))
                 .setResultados( [] )
    
    } finally {
        return resultado
    }
}