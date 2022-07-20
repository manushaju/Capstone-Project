const express = require('express')
const router = express.Router()
const NodeGeocoder = require('node-geocoder')
const alerts = require('../data/alerts')
let mapsData = require('../data/mapsData')
let middlewareObj = require('../middleware/index')
let listings = require('../models/listing')
let bookings = require('../models/booking')
let payments = require('../models/payment')
let functions = require('../data/functions')
const listing = require('../models/listing')

let custDetails = {
    email: "",
    phone: "",
    makeModel: "",
    licensePlate: "",
    province: "",
    parkingSpaceId: ""
}

let rates = {
    total: 0,
    tax: 0,
    netAmount: 0
}

router.get('/:listing', middlewareObj.isLoggedIn, (req, res) => {
    listing.findOne( {_id: req.params.listing}, (err, data) => {
        if(!err && data) {
            rates.total = parseFloat(data.hourlyRate) * 24
            rates.tax = rates.total * .13
            rates.netAmount = rates.total * rates.tax
            req.session.rates = rates
            console.log(rates.total)
            custDetails.parkingSpaceId = req.params.listing
            res.render('booking', {info: custDetails, rates: rates})
        }
    })
})

router.post('/:listing', middlewareObj.isLoggedIn, (req, res) => {
    
    let booking = new bookings ({
        parkingSpaceId: req.params.listing,
        userId: req.session.userId,
        fromTS: functions.convertDate(req.session.fromDate, req.session.fromTime),
        toTS: functions.convertDate(req.session.toDate, req.session.toTime),
        email: req.body.email,
        phone: req.body.phone,
        total: req.session.rates.total,
        tax: req.session.rates.tax,
        netAmount: req.session.rates.netAmount,
        licensePlate: req.body.licensePlate,
        makeModel: req.body.makeModel,
        province: req.body.province,
        isPaid: true,
    })
    booking.save().then(() => {
        bookings.find((err, data) => {
            let newPayment = new payments({
                bookingId: data[0]._id,
                bookingReferenceId: "temmp reference",
                amount: req.session.rates.netAmount,
                paymentMethod: "Paypal",
            })
            newPayment.save().then(() => {
                alerts.data = "Booking is confirmed"
                alerts.type = "success"
                res.render("home", {alert: true, alerts: alerts})
            })
        }).sort({_id: -1}).limit(1)
        
    })
})
module.exports = router