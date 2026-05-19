const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Post = new Schema({

    titulo:{
        type: String,
        required: true
    },
    slug:{
        type: String,
        required: true
    },

    descricao:{
        type: String,
        required: true
    },

    conteudo:{
        type: String,
        required: true
    },

    categoria:{ //Vai puxar o id de uma categoria do outro banco
        type: Schema.Types.ObjectId,
        ref: "categorias",
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    }


})

mongoose.model("posts", Post)