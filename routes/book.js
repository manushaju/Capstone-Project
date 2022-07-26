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
    console.log(req.params.listing)
    listings.findOne( {_id: req.params.listing}, (err, data) => {
        if(!err && data) {
            rates.total = parseFloat(data.hourlyRate) * 24
            rates.tax = rates.total * .13
            rates.netAmount = rates.total + rates.tax
            req.session.rates = rates
            console.log(rates.total)
            custDetails.parkingSpaceId = req.params.listing
            res.render('booking', {info: custDetails, rates: rates, session: req.session})
        }
    })
})

router.post('/:listing', middlewareObj.isLoggedIn, (req, res) => {
    let currentTS = new Date() 
    let booking = new bookings ({
        parkingSpaceId: req.params.listing,
        userId: req.session.userId,
        fromTS: new Date(req.session.fromTs),
        toTS: new Date(req.session.toTs),
        email: req.body.email,
        phone: req.body.phone,
        dateBooked: currentTS,
        total: req.session.rates.total,
        tax: req.session.rates.tax,
        netAmount: req.session.rates.netAmount,
        licensePlate: req.body.licensePlate,
        makeModel: req.body.makeModel,
        province: req.body.province,
        isPaid: true,
    })
    console.log(req.session)
    booking.save().then(() => {
        bookings.find((err, data) => {
            if(err) return
            let newPayment = new payments({
                bookingId: data[0]._id,
                bookingReferenceId: "temmp reference",
                amount: req.session.rates.netAmount,
                paymentMethod: "Paypal",
            })
            newPayment.save().then(() => {
                alerts.data = "Booking is confirmed"
                alerts.type = "success"
                res.render("home", {alert: true, alerts: alerts, session: req.session})
            })
        }).sort({_id: -1}).limit(1)
        let date = new Date()
    })
})
module.exports = router