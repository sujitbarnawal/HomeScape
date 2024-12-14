const Listing = require('../models/listing')


//index route
module.exports = index = async (req, res) => {
    let result = await Listing.find()
    res.render("./listings/index.ejs", { result })
}

//new route
module.exports.new = (req, res) => {
    res.render("./listings/new.ejs")
}

module.exports.createNew = async (req, res, next) => {
    try {
        let images = req.files.map(file => ({
            url: file.path,
            file_name: file.filename
        }));
        let newListing = new Listing(req.body);
        newListing.owner = req.user._id;
        newListing.images = images;
        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
    } catch (error) {
        next(error);
    }
};


//edit and update
module.exports.edit = async (req, res) => {
    let { id } = req.params
    let result = await Listing.findById(id)
    if (!result) {
        req.flash("error", "The listing has been deleted or does not exist.")
        return res.redirect('/listings')
    }

    // Render the existing image URLs
    let existingImages = result.images || []

    // Pass all the images to the EJS template
    res.render("./listings/edit.ejs", { r: result, existingImages })
}


module.exports.update = async (req, res) => {
    let { id } = req.params
    let result = req.body

    // Find the listing by ID
    let listing = await Listing.findById(id)

    if (!listing) {
        req.flash("error", "Listing not found.")
        return res.redirect('/listings')
    }

    // Update listing details from the body
    listing.title = result.title
    listing.description = result.description
    listing.price = result.price
    listing.location = result.location
    listing.country = result.country

    // Handle new image uploads (multiple)
    if (req.files && req.files.length > 0) {
        // Concatenate new images to existing images array
        let newImages = req.files.map(file => {
            return { url: file.path, file_name: file.filename }
        })

        // Append new images to the existing images array
        listing.images = [...listing.images, ...newImages]
    }

    // If no new image is uploaded, just save the listing
    await listing.save()

    req.flash("success", "Listing Updated!")
    res.redirect(`/listings/${id}`)
}

//delete route

module.exports.delete = async (req, res) => {
    let { id } = req.params
    await Listing.findByIdAndDelete(id)
    req.flash("success", " Listing Deleted!")
    res.redirect('/listings')
}

//show route

module.exports.show = async (req, res) => {
    let { id } = req.params
    let result = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner")
    if (!result) {
        req.flash("error", "The listing has been deleted or doesnot exits.")
        return res.redirect('/listings')
    }
    res.render("./listings/show.ejs", { r: result })
}