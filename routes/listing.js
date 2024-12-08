const express = require('express')
const router= express.Router()
const wrapAsync = require('../utils/wrapAsync.js')
const { listingSchema } = require('../schema.js')
const ExpressError = require('../utils/ExpressError.js')
const Listing = require('../models/listing')

const validateListing = (req, res, next) => {
    let { err } = listingSchema.validate(req.body)
    if (err) {
        let errMsg = err.details.map((el) => { el.message }).join(",")
        throw new ExpressError(400, errMsg)
    }
    next()
}

//index route

router.get('/', wrapAsync(async (req, res) => {
    let result = await Listing.find()
    res.render("./listings/index.ejs", { result })
}))

//create new routes
router.get('/new', (req, res) => {
    res.render("./listings/new.ejs")
})

router.post('/', validateListing, wrapAsync(async (req, res, next) => {
    let newListing = await new Listing(req.body)
    newListing.save()
    req.flash("success","New Listing Created!")
    res.redirect("/listings")
}))

//edit and update routes
router.get('/:id/edit',validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params
    let result = await Listing.findById(id)
    if(!result){
        req.flash("error","The listing has been deleted or doesnot exits.")
        return res.redirect('/listings')
    }
    
    res.render("./listings/edit.ejs", { r: result })
}))

router.put('/:id', validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params
    let result = req.body
    await Listing.findByIdAndUpdate(id, result)
    req.flash("success"," Listing Updated!")
    res.redirect(`/listings/${id}`)
}))

//Delete Route
router.delete('/:id', wrapAsync(async (req, res) => {
    let { id } = req.params
    await Listing.findByIdAndDelete(id)
    req.flash("success"," Listing Deleted!")
    res.redirect('/listings')
}))


//show route
router.get('/:id', wrapAsync(async (req, res) => {
    let { id } = req.params
    let result = await Listing.findById(id).populate("reviews")
    if(!result){
        req.flash("error","The listing has been deleted or doesnot exits.")
        return res.redirect('/listings')
    }
    res.render("./listings/show.ejs", { r: result })
}))


module.exports = router
