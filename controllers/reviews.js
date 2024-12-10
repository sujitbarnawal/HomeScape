const Review = require('../models/review')
const Listing = require('../models/listing')

module.exports.createReview=async (req, res) => {
    let { id } = req.params
    let listing = await Listing.findById(id)
    let newReview = new Review(req.body.review)
    newReview.author=req.user._id
    console.log(newReview.author);
    
    listing.reviews.push(newReview)
    await newReview.save()
    await listing.save()
    req.flash("success","New Review Created!")
    res.redirect(`/listings/${id}`)
}

module.exports.deleteReview=async (req, res) => {
    let { id, reviewId } = req.params
    //pull operator delete any instance of data from an array  on the basis of some specified condition
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash("success","Review Deleted!")
    res.redirect(`/listings/${id}`)
}