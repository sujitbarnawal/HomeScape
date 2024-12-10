if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const port = 3000

const mongoose = require("mongoose")
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError.js')


const listingRouter = require('./routes/listing.js')
const reviewRouter = require('./routes/review.js')
const userRouter = require('./routes/user.js')

const session =  require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./models/user.js')

main()
    .then(res => console.log("Connection Successful"))
    .catch(err => console.log(err))

async function main() {
    await mongoose.connect('mongodb://localhost:27017/wanderlust')
}

app.set("view enjine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, "/public")))

const sessionOptions={
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
        maxAge: 1000 * 60 * 60 * 24 * 3,
        httpOnly: true
    }
}

app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.get('/', (req, res) => {
    res.render('home.ejs')
})

app.use((req,res,next)=>{
    res.locals.success=req.flash('success')
    res.locals.error=req.flash('error')
    res.locals.currentUser=req.user
    next()
})

// app.get('/demouser',async (req,res)=>{
//     let fakeUser= new User({
//         email: 'sujit@gmail.com',
//         username: 'sujit'
//     })
//     let registeredUser = await User.register(fakeUser,"sujit123")
//     res.send(registeredUser)
// })

app.use('/listings', listingRouter)
app.use('/listings/:id/reviews',reviewRouter)
app.use('/',userRouter)

app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Page not found'))
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err
    res.status(statusCode).render('error.ejs', { err })
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})

