const Listing = require('./models/listing')
const Review = require('./models/review')
const { listingSchema,reviewSchema } = require('./schema')
const ExpressError = require('./utils/ExpressError')

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        //Redirect URL
        req.session.redirectURL=req.originalUrl
        req.flash("error","You must be logged in")
        return res.redirect('/login')
    }
    next()
}

module.exports.saveredirectURL=(req,res,next)=>{
    if(req.session.redirectURL){
        res.locals.redirectURL=req.session.redirectURL
    }
    next()
}

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params; // Ensure `id` is extracted from the request
    try {
        const listing = await Listing.findById(id).populate('owner');
        if (!listing) {
            req.flash("error", "Listing not found.");
            return res.redirect('/listings'); // Redirect to a safe fallback route
        }
        if (!listing.owner._id.equals(req.user._id)) {
            req.flash("error", "You don't have access to alter this listing.");
            return res.redirect(`/listings/${id}`);
        }
        next();
    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong. Please try again later.");
        return res.redirect('/listings');
    }
};

module.exports.isLoggedIn = (req,res,next)=>{
    console.log('Checking if user is logged in...')
    if(!req.isAuthenticated()){
        console.log('User is not logged in. Redirecting to login page...')
        //Redirect URL
        req.session.redirectURL=req.originalUrl
        req.flash("error","You must be logged in")
        return res.redirect('/login')
    }
    console.log('User is logged in. Proceeding...')
    next()
}

module.exports.saveredirectURL=(req,res,next)=>{
    console.log('Saving redirect URL...')
    if(req.session.redirectURL){
        console.log('Redirect URL saved.')
        res.locals.redirectURL=req.session.redirectURL
    }
    next()
}

module.exports.isOwner = async (req, res, next) => {
    console.log('Checking if user is owner...')
    const { id } = req.params; // Ensure `id` is extracted from the request
    try {
        console.log(`Finding listing with id ${id}...`)
        const listing = await Listing.findById(id).populate('owner');
        if (!listing) {
            console.log('Listing not found.')
            req.flash("error", "Listing not found.");
            return res.redirect('/listings'); // Redirect to a safe fallback route
        }
        console.log('Listing found. Checking ownership...')
        if (!listing.owner._id.equals(req.user._id)) {
            console.log('User is not owner.')
            req.flash("error", "You don't have access to alter this listing.");
            return res.redirect(`/listings/${id}`);
        }
        console.log('User is owner. Proceeding...')
        next();
    } catch (err) {
        console.error(err);
        console.log('Error occurred.')
        req.flash("error", "Something went wrong. Please try again later.");
        return res.redirect('/listings');
    }
};

module.exports.validateListing = (req, res, next) => {
    let { err } = listingSchema.validate(req.body)
    if (err) {
        let errMsg = err.details.map((el) => { el.message }).join(",")
        throw new ExpressError(400, errMsg)
    }
    next()
}


module.exports.validateReview = (req, res, next) => {
    let { err } = reviewSchema.validate(req.body)
    if (err) {
        let errMsg = err.details.map((el) => { el.message }).join(",")
        throw new ExpressError(400, errMsg)
    }
    next()
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id,reviewId } = req.params; // Ensure `id` is extracted from the request
    try {
        const review = await Review.findById(reviewId);
        if (!review) {
            req.flash("error", "Review not found.");
            return res.redirect('/listings'); // Redirect to a safe fallback route
        }
        if (!review.author._id.equals(req.user._id)) {
            req.flash("error", "You don't have access to alter this review.");
            return res.redirect(`/listings/${id}`);
        }
        next();
    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong. Please try again later.");
        return res.redirect('/listings');
    }
};