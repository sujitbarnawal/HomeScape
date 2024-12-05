const express = require('express')
const app = express()
const port = 3000
const mongoose = require("mongoose")
const Listing = require('./models/listing')
const Review = require('./models/review.js')
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const wrapAsync = require('./utils/wrapAsync.js')
const ExpressError = require('./utils/ExpressError.js')
const { listingSchema,reviewSchema } = require('./schema.js')

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

app.get('/', (req, res) => {
    res.render('home.ejs')
})

const validateListing = (req, res, next) => {
    let {err} = listingSchema.validate(req.body)
    if (err) {
        let errMsg = err.details.map((el) => { el.message }).join(",")
        throw new ExpressError(400, errMsg)
    }
    next()
}

const validateReview = (req,res,next)=>{
    let {err}=reviewSchema.validate(req.body)
    if(err){
        let errMsg=err.details.map((el)=>{el.message}).join(",")
        throw new ExpressError(400,errMsg)
    }
    next()
}

//index route
app.get('/listings', wrapAsync(async (req, res) => {
    let result = await Listing.find()
    res.render("./listings/index.ejs", { result })
}))

//create new routes
app.get('/listings/new', (req, res) => {
    res.render("./listings/new.ejs")
})

app.post('/listings', validateListing, wrapAsync(async (req, res, next) => {
    let newListing = await new Listing(req.body)
    newListing.save()
    res.redirect("/listings")
}))

//edit and update routes
app.get('/listings/:id/edit',validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params
    let result = await Listing.findById(id)
    res.render("./listings/edit.ejs", { r: result })
}))

app.put('/listings/:id', validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params
    let result = req.body
    await Listing.findByIdAndUpdate(id, result)
    res.redirect(`/listings/${id}`)
}))

//Delete Route
app.delete('/listings/:id', wrapAsync(async (req, res) => {
    let { id } = req.params
    await Listing.findByIdAndDelete(id)
    res.redirect('/listings')
}))


//show route
app.get('/listings/:id', wrapAsync(async (req, res) => {
    let { id } = req.params
    let result = await Listing.findById(id).populate("reviews")
    res.render("./listings/show.ejs", { r: result })
}))

//reviews route

app.post('/listings/:id/reviews',validateReview,wrapAsync(async (req,res)=>{
    let { id } = req.params
    let listing = await Listing.findById(id)
    let newReview = new Review(req.body.review)
    listing.reviews.push(newReview)
    await newReview.save()
    await listing.save()
    res.redirect(`/listings/${id}`)
}))


// delete reviews route

app.delete('/listings/:id/reviews/:reviewId',wrapAsync(async(req,res)=>{
    let { id, reviewId } = req.params
//pull operator delete any instance of data from an array  on the basis of some specified condition
    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/listings/${id}`)
}))


// app.get('/testListing',async (req,res)=>{
//     let sampleListing = new Listing({
//         title: "Bootcamp",
//         description: "Place for Gamers",
//         price: 200000,
//         location: "New York",
//         country: "USA"
//     })
//     await sampleListing.save()
//     res.send('done')
// })


app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Page not found'))
})

app.use((err, req, res, next) => {
    let { statusCode=500, message="Something went wrong" } = err
    res.status(statusCode).render('error.ejs', { err })
    // res.status(statusCode).send(message)
})



app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})

