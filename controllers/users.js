const User = require('../models/user.js')

//signup
module.exports.signup=(req, res) => {
    res.render('./users/signup.ejs')
}

module.exports.signupUser=async (req, res) => {
    try {
        let { username, email, password } = req.body
        let newUser = new User({ email, username })
        let registeredUser = await User.register(newUser, password)
        // console.log(registeredUser);
        req.login(registeredUser,(error)=>{
            if(error){
                return next(error)
            }
            req.flash("success", "Welcome to HomeScape")
            res.redirect('/listings')
        })
    } catch (error) {
        req.flash("error",error.message)
        res.redirect('/signup')
    }
}

//login
module.exports.login=(req,res)=>{
    res.render('./users/login.ejs')
}

module.exports.loginUser=async(req,res)=>{
    req.flash("success","Welcome back to Homescape,You are logged in!")
    let redirectURL = res.locals.redirectURL || "/listings"
    res.redirect(redirectURL)
}

//logout
module.exports.logout=(req,res)=>{
    req.logout((error)=>{
        if(error){
            return next(error)
        }
        req.flash("success","you are logged out!")
        res.redirect('/listings')
    })
}