const {z} = require("zod")

// Validação de erros (Schema) - Zod
    const postSchema = z.object({
        titulo: z.string()
            .trim()
            .min(3, "Título muito curto. Digite mais de 2 caracteres!")
            .max(35, "Título muito grande !")
            .nonempty("Complete o campo Título!"),

        slug: z.string()
            .trim()
            .min(3, "Slug muito curto. Digite mais de 9 caracteres!")
            .max(40, "Slug muito grande !")
            .nonempty("Complete o campo Slug!"),

        descricao: z.string()
            .trim()
            .min(10, "Descrição muito curta. Digite mais de 9 caracteres!")
            .max(200, "Descrição muito grande !")
            .nonempty("Complete o campo Descrição!"),

        conteudo: z.string()
            .trim()
            .min(10, "Conteúdo muito curto. Digite mais de 9 caracteres!")
            .max(5000, "Conteúdo muito grande !") 
            .nonempty("Complete o campo Conteúdo!"),

        categoria: z.string()
            .nonempty("Selecione uma categoria!")
        

    })

module.exports = { postSchema }