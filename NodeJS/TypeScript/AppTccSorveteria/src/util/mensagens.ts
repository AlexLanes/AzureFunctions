/**
 * Mensagens de Resposta utilizadas pela API
 */
export default {
	imagem: {
		sucesso: {
			/**
			 * @param quantidade Length do Resultado.resultados
			 * @returns `${ quantidade } imagem(ns) obtida(s)`
			 */
			obter: ( quantidade: number ): string => {
				return `${ quantidade } imagem(ns) obtida(s)`
			},

			/** "Upload da imagem realizado com sucesso" */
			upload: "Upload da imagem realizado com sucesso",

			/** "Imagem apagada com sucesso" */
			apagar: "Imagem apagada com sucesso"
		},
		erro: {
            /** "Imagem não encontrada" */
            não_encontrada: "Imagem não encontrada",

			/**
			 * @param mimeType Tipo do mime-type 
			 * @returns `O tipo da imagem '${ mimeType }' é inesperado`
			 */
			mimeType: ( mimeType: string ): string => {
				return `O tipo da imagem '${ mimeType }' é inesperado`
			},

			/** "Imagem não informada" */
			não_informada: "Imagem não informada"
		}
	},
    global: {
        sucesso: {
            /**
             * @param quantidade Length do Resultado.resultados
			 * @returns `${ quantidade } item(ns) obtido(s)` 
             */
			obter: ( quantidade: number ): string => { 
				return `${ quantidade } item(ns) obtido(s)` 
			},
		
			/** "Item criado com sucesso" */ 
			criar: "Item criado com sucesso",
		
			/** "Item apagado com sucesso" */ 
			apagar: "Item apagado com sucesso",
		
			/** "Item atualizado com sucesso" */ 
			atualizar: "Item atualizado com sucesso"
        },
        erro: {
            /**
             * @param erro Erro capturado no Catch
			 * @returns `Erro interno. ${erro}` 
             */
            interno: ( erro: Error ): string => { 
                return `Erro interno. ${erro}` 
            },

            /** "Item já existente na base de dados" */
            duplicado: "Item já existente na base de dados",

            /** "Item não encontrado" */
            não_encontrado: "Item não encontrado" 
        }
    }
}