const express = require('express')
const router = express.Router({mergeParams: true})
const wrapAsync = require('../utils/wrapAsync.js')
const ExpressError = require('../utils/ExpressError.js')
const { reviewSchema } = require('../schema.js')
const Review = require('../models/review.js')
const Listing = require('../models/listing')



const validateReview = (req, res, next) => {
    let { err } = reviewSchema.validate(req.body)
    if (err) {
        let errMsg = err.details.map((el) => { el.message }).join(",")
        throw new ExpressError(400, errMsg)
    }
    next()
}

//reviews route

router.post('/', validateReview, wrapAsync(async (req, res) => {
    let { id } = req.params
    let listing = await Listing.findById(id)
    let newReview = new Review(req.body.review)
    listing.reviews.push(newReview)
    await newReview.save()
    await listing.save()
    res.redirect(`/listings/${id}`)
}))


// delete reviews route

router.delete('/:reviewId', wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params
    //pull operator delete any instance of data from an array  on the basis of some specified condition
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/listings/${id}`)
}))


module.exports = router