//Conexôes e dependências
const express = require("express")
const router = express.Router()
const mongoose = require('mongoose') 
const { z, ZodError, email } = require("zod")
const {isAdmin} = require("../helpers/isAdmin")

// Models
require("../models/Categoria")
require("../models/Post")
require("../models/User")
const Categoria = mongoose.model("categorias")
const Post = mongoose.model("posts")
const User = mongoose.model('users')

// Validação de erros (Schema) - Zod
const {categoriaSchema} = require("../validators/categoriaSchema")
const {postSchema} = require("../validators/postSchema")
const {userSchema} = require('../validators/userSchema')
const {editUserSchema} = require("../validators/editUserSchema")

//Rotas 
router.get('/', isAdmin, (req, res) =>{
    res.render("admin/indexAdmin")
})

//Listagem de categorias
router.get("/categorias", isAdmin, async (req, res) =>{
    try{
       const categorias = await Categoria.find().sort({date: 'desc'}).lean()
        res.render("admin/categoriasViews/categorias", {categorias: categorias})

    }catch(err){
        req.session.flash = {
            type: "alert-danger",
            msg: "Erro ao listar categorias, Tente novamente!"
        }
        res.redirect("/admin")
    }
})

//Pagina de adição de categorias
router.get("/categorias/add", isAdmin, (req, res)=>{  
    res.render("admin/categoriasViews/addcategorias")
})

//Criar nova categoria
router.post("/categorias/nova", isAdmin, async (req, res) =>{ 
    try{
        const {nome, slug } = req.body
        //Validação
        categoriaSchema.parse({nome, slug})
        //Salva no banco
        await Categoria.create({nome, slug})
        //Mensagem de sucesso
        req.session.flash = {
            type: "alert-success",
            msg: "Categoria salva com sucesso"
        }
        res.redirect("/admin/categorias")

    //Se der erro
    } catch(err){ 
        let erros = []

        //Erro no zod
        if (err instanceof ZodError){
            erros = err.issues.map(e => ({texto: e.message}))
            return res.render("admin/categoriasViews/addcategorias", {erros})  
    } else{
        //Erro genérico
        req.session.flash = {
            type: "alert-danger",
            msg: "Erro ao salvar categoria"
        }
        res.redirect("/admin/categorias/add")
    }

}})

router.get("/categorias/edit/:id", isAdmin, async(req, res) =>{ //Entrar na pagina que edita puxando id 
    try{
        const {id} = req.params
        //Puxa a categoria pra mostrar no input
        const categoria = await Categoria.findById(id).lean()
        res.render("admin/categoriasViews/editcategorias", {categoria: categoria})
    

    }catch(err){
        req.session.flash = {
            type: "alert-danger",
            msg: "Erro ao editar categoria, Tente novamente."
        }
        res.redirect("/admin/categorias")
    }


})
//Conclui edição
router.post("/categorias/edit", isAdmin, async (req, res) =>{ 
    let {nome, slug, id} = req.body
    try{
        //Validação
        categoriaSchema.parse({nome, slug})
        //Atualiza no banco
        await Categoria.findByIdAndUpdate(id, {nome, slug})
        //Mensagem de sucesso
        req.session.flash ={
            type: 'alert-success',
            msg: "Categoria editada com sucesso"
        }
        //Redireciona pra pagina de categorias
        res.redirect("/admin/categorias")
    } catch(err){
        //Verifica se é do zod e renderiza a pagina de edição com os erros e os dados preenchidos
        let erros = []

        if(err instanceof ZodError){
            erros = err.issues.map(e => ({texto: e.message}))
            return res.render("admin/categoriasViews/editcategorias", {erros, categoria: {nome, slug, _id: id}})
        } else{
            req.session.flash = {
                type: "alert-danger",
                msg: "Erro ao editar categoria"
            }
            res.redirect("/admin/categorias/edit")
        }
    }

})




router.get("/categorias/exc", isAdmin, async(req, res) =>{ //Pagina que mostra itens e da opção de excluir
    try{
      const categorias =  await Categoria.find().sort({date: "desc"}).lean()
      res.render("admin/categoriasViews/exccategorias", {categorias: categorias})

    }catch(err){
        req.session.flash = {
            type: "alert-danger",
            msg: "Erro ao carregar categorias, Tente novamente!"
        }
        res.redirect("/admin/categorias")
    }
})

router.post("/categorias/deletado/:id", isAdmin, async (req, res)=>{ //Excluir itens e voltar pras categorias
    try{
        const {id} = req.params
        await Categoria.findByIdAndDelete(id)

        req.session.flash = {
            type: "alert-success",
            msg: "Categoria excluida com sucesso!"
        }

        res.redirect("/admin/categorias")
         
    }catch(err){
        req.session.flash = {
            type: "alert-danger",
            msg: "Erro ao excluir categoria, Tente novamente!"
        }
        res.redirect("/admin/categorias")
    }
})




//Renderizar os posts
router.get("/posts", isAdmin, async (req, res) =>{
    try {
        const posts = await Post.find()
            .populate("categoria", "nome") //Porque é de outro documento
            .sort({ date: 'desc' })
            .lean()
            
        res.render("admin/postsViews/posts", { posts })
    } catch (err) {
        req.session.flash = {
            type: "alert-danger",
            msg: "Erro ao listar posts, Tente novamente!"
        }
        res.redirect("/admin")
    }
})

//Renderizar formulario de add de post (enviando categorias)
router.get("/posts/add", isAdmin, async (req, res) =>{ 
    try{
        const categorias = await Categoria.find().lean()
        res.render("admin/postsViews/addposts", {categorias: categorias})
    }catch(err){
        req.session.flash = {
            msg: "Houve um erro ao carregar o formulario",
            type: "alert-danger"
        }
        res.redirect("/admin")
        
    }
})

//Cria o post no banco de dados, com validação e mensagens de erro/sucesso
router.post("/posts/nova", isAdmin, async (req, res) =>{
    const {titulo, slug, descricao, conteudo, categoria} = req.body
    try{
        //Validação
        postSchema.parse({titulo, slug, descricao, conteudo, categoria})
        //Salvar no banco
        await Post.create({titulo, slug, descricao, conteudo, categoria})
        //Mensagem de sucesso
        req.session.flash = {
            type: "alert-success",
            msg: "Post criado com sucesso!"
        }
        res.redirect("/admin/posts")

    } catch(err){
        let erros = []
        //Erro do zod
        if(err instanceof ZodError){
            const categorias = await Categoria.find().lean()
            erros = err.issues.map(e => ({texto: e.message}))

            return res.render("admin/postsViews/addposts", {
                categorias, //Enviar categorias pra preencher o select
                erros,
                titulo,
                slug,
                descricao,
                conteudo,
                categoria  //Opção do usuario
            })
        }
        //Erro genérico
        req.session.flash = {
            type: "alert-danger",
            msg: "Houve um erro ao criar o post, Tente novamente!"
        }
        res.redirect("/admin/posts/add")
    }
})

//Renderizar pagina de edição de post
router.get("/posts/edit/:id", isAdmin, async (req, res) =>{ 
    
    try{

    const {id} = req.params
    const posts = await Post.findById(id).lean()
    const categorias = await Categoria.find().lean()
    res.render("admin/postsViews/editposts", {posts, categorias})

    }catch(err){

        req.session.flash = {
            type: "alert-danger",
            msg: "Houve um erro ao carregar o formulário de edição, Tente novamente!"
        }
        res.redirect("/admin/posts")
}})

router.post("/posts/edit", isAdmin, async (req, res) =>{
    const {id, titulo, slug, descricao, conteudo, categoria} = req.body
    try{
        //Validação
        postSchema.parse({titulo, slug, descricao, conteudo, categoria})
        //Atualizar no banco
        await Post.findByIdAndUpdate(id, {titulo, slug, descricao, conteudo, categoria})
        //Mensagem de sucesso
        req.session.flash = {
            type: "alert-success",
            msg: "Post editado com sucesso!"
        }
        res.redirect("/admin/posts")
    } catch(err){
        let erros = []

        if(err instanceof ZodError){
            const categorias = await Categoria.find().lean()
            erros = err.issues.map(e => ({texto: e.message}))
            return res.render("admin/postsViews/editposts", {
                erros,
                categorias,
                posts:{id, titulo, slug, descricao, conteudo, categoria}
            
            })
        }}
    })

router.get("/posts/exc/:id", isAdmin, async(req, res) =>{
    const {id} = req.params
    try{
        await Post.findByIdAndDelete(id)
        req.session.flash = {
            type: "alert-success",
            msg: "Post excluido com sucesso!"
        }
        res.redirect("/admin/posts")
    } catch(err){
        req.session.flash = {
            type: "alert-danger",
            msg: "Houve um erro ao excluir o post, Tente novamente!"
        }
        res.redirect("/admin/posts")
    }
})

router.get("/users", isAdmin, async (req, res) =>{

    //Fazer amanha uma pagina onde mostre todos usuarios e 
    // com botes dando permissão de admin ou excluindo usuarios e editando
    try{

        const users = await User.find().lean()
        res.render("admin/userViews/usersList", {users})
    }catch(err){
        req.session.flash = {
            type: "alert-danger",
            msg: 'Erro ao procurar usuarios, tente novamente.'
        }
        res.redirect('/admin')

    }
})

router.get('/users/delete/:id', isAdmin, async(req, res) =>{
    const {id} = req.params

    try{
        await User.findByIdAndDelete(id)
        req.session.flash = {
            type: "alert-success",
            msg: "Usuario deletado com sucesso"
        }
        res.redirect("/admin/users")
    }catch(err){
        req.session.flash = {
            type: "alert-danger",
            msg: "Erro ao deletar usuario"
        }
        res.redirect("/admin/users")

    }
})



router.get("/users/edit/:id", isAdmin, async(req, res) =>{
    const {id} = req.params
    try{
    const user = await User.findById(id).lean()
    res.render('admin/userViews/editUser', {layout: "auth", user})

    }catch(err){
        req.session.flash = {
            type: 'alert-danger',
            msg: "Erro ao editar usuario"
        }
        res.redirect("/admin/users")
    }
})




router.post('/users/edit',isAdmin, async (req, res) =>{
    const {id, ...userData} = req.body

    try{
        editUserSchema.parse(userData)

        await User.findByIdAndUpdate(id, userData)

        req.session.flash = {
            type: "alert-success",
            msg: "Usuario modificado com sucesso"
        }
        res.redirect("/admin/users")

    }catch(err){

        let erros = []

        if(err instanceof ZodError){
            erros = err.issues.map(e => ({texto: e.message}))
            return res.render("admin/userViews/editUser", {
                layout: 'auth',
                user: {id, ...userData},
                erros
            })
        }

        req.session.flash = {
            type: "alert-danger",
            msg: "Erro ao modificar usuario"
        }
        res.redirect("/admin/users")

}})

router.get("/users/toggleAdmin/:id", isAdmin, async(req, res)=>{
    const {id} = req.params

    try{
        const user = await User.findById(id)
        if(user.isAdmin){
            await User.findByIdAndUpdate(id, {isAdmin: 0})

        } else{
            await User.findByIdAndUpdate(id, {isAdmin: 1})
        }
        req.session.flash = {
            type: "alert-success",
            msg: "Cargo atualizado com sucesso"
        }
        res.redirect("/admin/users")
    }
    
    catch(err){

        req.session.flash = {
            type: "alert-danger",
            msg: "Erro ao atualizar cargo, Tente novamente"
        }
        res.redirect("/admiin/users")
    }
})





module.exports = router //Exportar pra outros arquivos