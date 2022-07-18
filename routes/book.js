const express = require('express')
const router = express.Router()
const NodeGeocoder = require('node-geocoder')
const alerts = require('../data/alerts')
var mapsData = require('../data/mapsData')
var middlewareObj = require('../middleware/index')
var listings = require('../models/listing')

router.get('/:listing', middlewareObj.isLoggedIn, (req, res) => {
    console.log(req.params.listing)
    var date = new Date(2018, 11, 24, 10, 33, 30)
    console.log(date)
    res.render('home')
})

module.exports = router