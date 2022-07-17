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
    hourlyRate: String,
    monthlyRate: String,
})

module.exports = mongoose.model("Listing", schema);