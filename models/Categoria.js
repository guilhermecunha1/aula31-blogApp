//Montado na aula 35
    const mongoose = require("mongoose")
    const Schema = mongoose.Schema

    const Categoria = new Schema({
        nome: {
            type: String,
            required: [true, "Complete o campo (nome) por favor."],
        },
        slug: {
            type: String,
            required: [true, "Complete o campo (Slug) por favor."]
        },
        date:{
            type: Date,
            default: Date.now 
        }
    })

    mongoose.model("categorias", Categoria) // Primeiro parametro no arquivo admin.js