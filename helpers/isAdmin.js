module.exports = {
    isAdmin: function(req, res, next){

        if(req.isAuthenticated() && req.user.isAdmin == 1){
            return next()
        }

        req.session.flash = {
            type: "alert-danger",
            msg:"Acesso nao autorizado, verifique se há permissão para a entrada."
        }
        res.redirect("/")


    }
}