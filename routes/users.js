const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const {z, ZodError} = require("zod")
const bcrypt =  require("bcryptjs")
const { userSchema } = require("../validators/userSchema")
const passport = require("passport")



//Models
require("../models/User")
const User = mongoose.model("users")


    //Renderiza Pagina que registra usuarios
router.get("/registro", (req, res) =>{
    res.render("users/registroUser", {layout: "auth"})

})
    //Conclui cadastro com as verificações  
router.post("/cadastro", async (req, res) => {
    try{
        const {nome, email, senha, senha2} = req.body
        //Verificar oque foi digitado
        userSchema.parse({nome, email, senha})
        //Verifica se as 2 senhas sao as mesmas
        if(senha !== senha2){
            req.session.flash = {
                type: "alert-danger",
                msg: "Digite a mesma senha nos 2 campos por favor."
            }
            req.session.oldInput = { nome, email }
            return res.redirect("/users/registro")
        }

        
        //Verificação de email
            //Verifica se existe um usuario com o mesmo email digitado
            const usuario = await User.findOne({email})
            //Se esse usuario com o mesmo email existir:
            if (usuario){

                req.session.flash = {
                    type: "alert-danger",
                    msg: 'Ja existe um usuario com este E-mail, use outro email ou inicie outra sessão.'
                }

                req.session.oldInput = {nome}
                return res.redirect("/users/registro")
            }

            //Criptografia
            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(senha, salt)

            await User.create({nome, email, senha: hash,})
            req.session.flash = {
                type: 'alert-success',
                msg: 'Usuario criado com sucesso'
                }
            res.redirect("/")
            

    //Erros de digitação 
    }catch(err){
        const {nome, email} = req.body
        let erros = []

        if (err instanceof ZodError){
            erros = err.issues.map( e=> ({texto: e.message}))
            req.session.oldInput = { nome, email}
            req.session.erros = erros
            return res.redirect("/users/registro")
        //Outro erro generico
        } else{
            req.session.flash = {
                type: 'alert-danger',
                msg: 'Erro ao criar novo usuario, Tente novamente.'
            }
            return res.redirect("/users/registro")
        }
    }
})

router.get('/login', (req, res) =>{
    
    res.render('users/login', {layout: 'auth'})

})

router.post('/login', async (req, res, next) =>{
    
    passport.authenticate('local', {
        successRedirect:'/',
        failureRedirect: '/users/login',
        failureFlash: true
    }) (req, res, next)

})

router.get("/logout", (req, res) =>{

    req.logout(function(err){

        if(err){
            return next(err)
        }

        req.session.flash = {
            type: "alert-success",
            msg: "Conta desconectada com sucesso"
        }

        res.redirect("/")
    })


})




module.exports = router