const mongoose = require("mongoose")

const schema = mongoose.Schema({
    parkingSpaceId: String,
    userId: String,
    fromTS: String,
    toTS: String,
    email: String,
    phone: String,
    licensePlate: String,
    makeModel: String,
    province: String,
    isPaid: Boolean
    
})

module.exports = mongoose.model("Booking", schema);