const express = require('express')
const app = express()
const port = 3000
const mongoose = require("mongoose")
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError.js')
const listings = require('./routes/listing.js')
const reviews = require('./routes/review.js')
const session =  require('express-session')
const flash = require('connect-flash')

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

app.get('/', (req, res) => {
    res.render('home.ejs')
})

app.use((req,res,next)=>{
    res.locals.success=req.flash('success')
    res.locals.error=req.flash('error')
    next()
})

app.use('/listings', listings)
app.use('/listings/:id/reviews',reviews)

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

