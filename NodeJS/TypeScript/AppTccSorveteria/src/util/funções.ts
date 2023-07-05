/**
 * Normalizar uma string implica em fazer o trim, lower-case, 
 * remover_acento e substituir espaços por "_"
 */
export function normalizar( string: string ): string {
    string = string.trim().toLowerCase()
	string = remover_acento( string )
    return string.replaceAll( /\s+/g, "_" )
}

/**
 * Substitui acentuação de uma string pela sua versão sem acento
 */
export function remover_acento( string: string ): string {
    return string
        .normalize( "NFD" )
        .replace( /[\u0300-\u036f]/g, "" )
}

/**
 * Checar se uma string é null, "" ou undefined
 */
export function isNullEmptyUndefined( string?: string ): boolean {
    return string === undefined || string === null || string === ""
}