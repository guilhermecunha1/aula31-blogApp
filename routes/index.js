const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")

//Models:
require("../models/Categoria")
require("../models/Post")
const Categoria = mongoose.model("categorias")
const Post = mongoose.model("posts")


    router.get("/", async(req, res) =>{
        try{
            const posts = await Post.find().lean().populate("categoria", "nome")
            const categorias = await Categoria.find().lean()
            res.render("index", {posts, categorias})
        } catch(err){
            req.session.flash = {
                type: "alert-danger",
                msg: "Erro ao carregar os posts"
            }
            res.redirect("/404")
        }
    })

    router.get("/posts", async (req, res) => {
        try{
            const posts = await Post.find().lean().populate("categoria", "nome")
            res.render("posts/indexPosts", {posts})
        } catch(err){
            req.session.flash = {
                type: "alert-danger",
                msg: "Erro ao achar categorias"
            }
            res.redirect("/404")
        }
    })

    router.get("/post/:slug", async(req, res) =>{
        try{
            const post = await Post.findOne({slug: req.params.slug}).lean().populate('categoria', "nome")
            if (post){
                return res.render("posts/postPage", {post})
            }
            req.session.flash = {
                type: 'alert-danger',
                msg: "Nenhum Post encontrado."
            }
            res.redirect("/")

        }catch(err){
            req.session.flash ={
                type: "alert-danger",
                msg: "Erro ao achar postagem"
            }
            res.redirect("/")
        }
    })

    router.get("/categorias", async(req, res) =>{
        try{
            const categorias = await Categoria.find().lean()
            res.render("categorias/indexCategorias", {categorias})
        } catch(err){
            req.session.flash = {
                type: "alert-danger",
                msg: "Erro ao achar categorias"
            }
            res.redirect("/404")
        }
    })

    router.get("/categorias/:slug", async (req, res) =>{
        try{
            const categoria = await Categoria.findOne({slug: req.params.slug}).lean()
            if (categoria){
                
                const posts = await Post.find({categoria: categoria._id}).lean()
                return res.render("categorias/categoriaPosts", {categoria, posts})

            }
            req.session.flash = {
                type: "alert-danger",
                msg: "Categoria nao encontrada"
            }
            res.redirect("/")
        }catch(err){
            req.session.flash = {
                type: "alert-danger",
                msg: "Erro ao procurar categoria"
            }
            res.redirect("/")
        }
    })

    



    router.get("/404", (req, res)=>{
        res.send("ERRO 404!")
    })

module.exports = router