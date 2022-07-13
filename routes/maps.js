const express = require('express')
const router = express.Router()
const NodeGeocoder = require('node-geocoder');

// Setup Geocoder options
var options = {
    provider: "google",
    httpAdapter: "https",
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
}

var geocoder = NodeGeocoder(options)

var mapsData = {
    name: "Hello world",
    location: "Goldbeck lane",
    desciption: "Temp Desc",
    lat: 0,
    lng: 0,
}

router.get('/', (req, res) => {
    res.render("maps", {mapsData: mapsData})
}) 

router.post('/', (req, res) => {
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
          console.log(err);
        }
        mapsData.lat = data[0].latitude;
        mapsData.lng = data[0].longitude;
        mapsData.location = data[0].formattedAddress;
    })
    res.render("maps", {mapsData: mapsData})
})

module.exports = router