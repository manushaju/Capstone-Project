const mongoose = require("mongoose")

const schema = mongoose.Schema({
    parkingSpaceId: String,
    userId: String,
    fromTS: String,
    toTS: String,
    
})

module.exports = mongoose.model("Listing", schema);