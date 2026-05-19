const  z = require("zod")

const userSchema = z.object({
    nome: z.string()
        .trim()
        .min(3, 'O nome deve conter pelo menos 3 caracteres')
        .max(100, 'Nome muito longo, Tente novamente>')
        .regex(/^[A-Za-zÀ-ÿ\s]+$/, "Nome deve conter apenas letras"),
    email: z.string()
        .trim()
        .email("E-mail invalido !")
        .toLowerCase(),
    senha: z.string()
        .min(8,  "Sua senha deve ter pelo menos 8 caracteres")
        .max(20, "Senha muito longa, Tente novamente.")
})



module.exports = {userSchema}