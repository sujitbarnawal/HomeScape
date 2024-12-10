const Listing = require('../models/listing')


//index route
module.exports=index=async (req, res) => {
    let result = await Listing.find()
    res.render("./listings/index.ejs", { result })
}

//new route
module.exports.new=(req, res) => {
    res.render("./listings/new.ejs")
}

module.exports.createNew=async (req, res, next) => {
    let newListing = await new Listing(req.body)
    newListing.owner = req.user._id
    newListing.save()
    req.flash("success","New Listing Created!")
    res.redirect("/listings")
}

//edit and update

module.exports.edit=async (req, res) => {
    let { id } = req.params
    let result = await Listing.findById(id)
    if(!result){
        req.flash("error","The listing has been deleted or doesnot exits.")
        return res.redirect('/listings')
    }
    
    res.render("./listings/edit.ejs", { r: result })
}

module.exports.update=async (req, res) => {
    let { id } = req.params
    let result = req.body
    await Listing.findByIdAndUpdate(id, result);
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}

//delete route

module.exports.delete=async (req, res) => {
    let { id } = req.params
    await Listing.findByIdAndDelete(id)
    req.flash("success"," Listing Deleted!")
    res.redirect('/listings')
}

//show route

module.exports.show=async (req, res) => {
    let { id } = req.params
    let result = await Listing.findById(id).populate({path: "reviews",populate:{path: "author"}}).populate("owner")
    if(!result){
        req.flash("error","The listing has been deleted or doesnot exits.")
        return res.redirect('/listings')
    }
    res.render("./listings/show.ejs", { r: result })
}