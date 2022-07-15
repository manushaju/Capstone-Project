const express = require('express')
const router = express.Router()
const NodeGeocoder = require('node-geocoder');
const alerts = require('../data/alerts')

// Setup Geocoder options
var options = {
    provider: "google",
    httpAdapter: "https",
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
}

var geocoder = NodeGeocoder(options)

var mapsData = {
    name: "",
    location: "",
    desciption: "",
    lat: 0,
    lng: 0,
}

router.get('/', (req, res) => {
    res.render("maps", {mapsData: mapsData})
}) 

router.get('/:location', (req, res) => {
    geocoder.geocode(req.params.location, function (err, data) {
        if (err || !data.length) {
          alerts.data = "Invalid address, try again"
          alerts.type = "danger"
        }

        if (data.length) {
            mapsData.lat = data[0].latitude;
            mapsData.lng = data[0].longitude;
            mapsData.location = data[0].formattedAddress;
        }
    })
    res.render("maps", {mapsData: mapsData})
}) 

router.post('/', (req, res) => {
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
          alerts.data = "Invalid address, try again"
          alerts.type = "danger"
        }

        if (data.length) {
            mapsData.lat = data[0].latitude;
            mapsData.lng = data[0].longitude;
            mapsData.location = data[0].formattedAddress;
        }
    })
    res.render("maps", {mapsData: mapsData, alert: true, alerts: alerts})
})

module.exports = router