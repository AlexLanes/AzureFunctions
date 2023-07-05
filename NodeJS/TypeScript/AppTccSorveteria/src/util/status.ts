/**
 * Retorna um http status code, baseado na mensagem do resultado.
 * Usar para códigos 400 ou 500 apenas
 * @param mensagem Mensagem do resultado
 */
export function status_mensagem( mensagem: string ): number {
    switch( true ){
        case mensagem.includes("tipo da imagem"):
            return 400
        case mensagem.includes("encontrado"):
        case mensagem.includes("encontrada"):
            return 404
        case mensagem.includes("existente"):
            return 409
        default: 
            return 500
    }
}