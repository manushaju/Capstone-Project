const express = require('express')
const router = express.Router()
const NodeGeocoder = require('node-geocoder')
const alerts = require('../data/alerts')
let mapsData = require('../data/mapsData')
let middlewareObj = require('../middleware/index')
let listings = require('../models/listing')
let bookings = require('../models/booking')
let functions = require('../data/functions')

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
    net: 0
}

router.get('/:listing', middlewareObj.isLoggedIn, (req, res) => {
    rates.total = 10.21
    rates.tax = rates.total * .13
    rates.net = rates.total + rates.tax
    custDetails.parkingSpaceId = req.params.listing
    res.render('booking', {info: custDetails, rates: rates})
})

router.post('/:listing', middlewareObj.isLoggedIn, (req, res) => {
    let booking = new bookings ({
        parkingSpaceId: req.params.listing,
        userId: req.session.userId,
        fromTS: functions.convertDate(req.session.fromDate, req.session.fromTime),
        toTS: functions.convertDate(req.session.toDate, req.session.toTime),
        email: req.body.email,
        phone: req.body.phone,
        licensePlate: req.body.licensePlate,
        makeModel: req.body.makeModel,
        province: req.body.province,
        isPaid: true,
    })
    booking.save().then(() => {
        alerts.data = "Booking is confirmed"
        alerts.type = "success"
        res.render("home", {alert: true, alerts: alerts})
    }).then(() => {
        console.log('All over')
    })
})
module.exports = router