const z = require("zod")
// Validação de erros (Schema) - Zod
    const categoriaSchema = z.object({
        nome: z.string()
            .trim()
            .nonempty("Complete o campo Nome!")
            .min(3, "Nome muito curto. Digite mais de 2 caracteres!")
            .max(40, "Nome muito grande !"),
            

        slug: z.string()
            .trim()
            .nonempty("Complete o campo Slug!")
            .min(3, "Slug muito curto. Digite mais de 9 caracteres!")
            .max(40, "Slug muito grande !")
            

    })

module.exports = { categoriaSchema }