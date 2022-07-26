const mongoose = require("mongoose")

const schema = mongoose.Schema({
    addressLine1: String,
    addressLine2: String,
    city: String,
    province: String,
    zipcode: String,
    phone: String,
    images: Array,
    userId: String,
    hourlyRate: Number,
    monthlyRate: Number,
})
//this is a comment
module.exports = mongoose.model("Listing", schema);
