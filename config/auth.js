const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

//Model de usuarios
require('../models/User')
const User = mongoose.model('users')

module.exports = function(passport){

    passport.use(new localStrategy({usernameField: 'email', passwordField: 'senha'}, async (email, senha, done) =>{

           const user = await User.findOne({email: email})
            if (!user){
                return done(null, false, {message: 'Essa conta nao existe'})
            }
            
            bcrypt.compare(senha, user.senha, (erro, batem) =>{
                if (batem) {return done(null, user)}
                if (!batem){return done(null, false, {message: 'Senha incorreta !'})}
                if(erro) {return done(erro) }
            })
    }))

    passport.serializeUser((user, done) =>{
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done)=>{
        try{
            const user = await User.findById(id)
            done(null, user)
        } catch (err) {
            done(err)
        }
    })

}