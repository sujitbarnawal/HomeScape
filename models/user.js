const mongoose = require('mongoose')
const { Schema } = mongoose
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new Schema ({
    email: {
        type: String,
        required: true,
    }
})

User.plugin(passportLocalMongoose)
module.exports=User
