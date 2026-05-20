require('dotenv').config()
//Carregando Modulos
    const express = require("express")
    const app = express()
    const handlebars = require("express-handlebars")
    const bodyParser = require("body-parser")
    const path = require('path')
    const mongoose = require("mongoose")
    const session = require('express-session')
    const flash = require('connect-flash')

    //Rotas
        const adminRoutes = require("./routes/admin")
        const indexRoutes = require("./routes/index")
        const usersRoutes = require("./routes/users")


    //Passport
    const passport = require('passport')
    require('./config/auth')(passport)

    //Models
    require("./models/Post")
    const Post = mongoose.model("posts")

    require("./models/Categoria")
    const Categoria = mongoose.model("categorias")

    //Porta
    const PORT = process.env.PORT || 7373;

//Configurações dos Modulos

    // Sessão - Aula 39
        app.use(session({
                secret: process.env.SESSION_SECRET,
                resave: true,
                saveUninitialized: true,
        }))

        app.use(flash())

        //Conexão com o passport
        app.use(passport.initialize())
        app.use(passport.session())

    // Middlewares - Aula 39
        app.use((req, res, next) => {
        res.locals.flash = req.session.flash;
        res.locals.oldInput = req.session.oldInput || {}
        res.locals.erros = req.session.erros || []

        //jeito correto com connect flash - Login
        res.locals.error = req.flash("error")
        res.locals.user = req.user || null
        
        req.session.flash = null
        req.session.oldInput = null
        req.session.erros = null
        next();
        });


    //Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())

    //Handlebars
        app.engine("handlebars", handlebars.engine({defaultLayout:'main'}))
        app.set("view engine", 'handlebars')

    //Public - Aula 33
        app.use(express.static(path.join(__dirname, "public")))
        app.use((req, res, next) =>{
            next()
        })

        
    //Mongoose - Olhar depois !
        mongoose.connect(process.env.MONGO_URI)
        .then(()=>{
            console.log("Banco conectado com sucesso !")
        }).catch((err)=>{
            console.error("Erro ao conectar ao banco de dados", err)
        })

//Rotas
    app.use("/", indexRoutes)        
    app.use("/admin", adminRoutes)
    app.use("/users", usersRoutes)





//Outros
app.listen(PORT, ()=>{
    console.log(`Servidor rodando na porta http://localhost:${PORT}`)
})

