const mongoose = require('mongoose')
const initData = require('./data.js')
const Listing = require('../models/listing.js')

main()
    .then(res => console.log("Connection Successful"))
    .catch(err => console.log(err))

async function main() {
    await mongoose.connect('mongodb://localhost:27017/wanderlust')
}

const initDB = async () => {
    await Listing.deleteMany({})
    initData.data = initData.data.map((obj)=>({...obj,owner: '67553ad5d122cbdf7bb57daa'}))
    await Listing.insertMany(initData.data)
    console.log("Data was initialized");
}

initDB();