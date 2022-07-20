const mongoose = require("mongoose")

const schema = mongoose.Schema({
    parkingSpaceId: String,
    userId: String,
    fromTS: Date,
    toTS: Date,
    total: Number,
    tax: Number,
    netAmount: Number,
    email: String,
    phone: String,
    licensePlate: String,
    makeModel: String,
    province: String,
    isPaid: Boolean
    
})

module.exports = mongoose.model("Booking", schema);