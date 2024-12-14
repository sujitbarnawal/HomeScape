const mongoose = require('mongoose')
const { Schema } = mongoose
const Review = require('./review.js')

let listingSchema = Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    images: [
        {
            url: String,
            file_name: String,
        }
    ],
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } })
    }
})

let Listing = mongoose.model("Listing", listingSchema)

module.exports = Listing