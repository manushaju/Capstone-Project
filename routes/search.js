const express = require('express')
const router = express.Router()
const NodeGeocoder = require('node-geocoder')
const alerts = require('../data/alerts')
var mapsData = require('../data/mapsData')
var middlewareObj = require('../middleware/index')
var listings = require('../models/listing')

//for adding Distance Calculations
const Client  = require('@googlemaps/google-maps-services-js').Client

const client = new Client({
    key: process.env.GEOCODER_API_KEY
})



// Setup Geocoder options
var options = {
    provider: "google",
    httpAdapter: "https",
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
}

var geocoder = NodeGeocoder(options)



router.get('/', async function(req, res)  {
    res.render("maps", {mapsData: mapsData})
}) 


router.get('/distance', async function(req, res)  {
    var newLocations = []
    var locations = []
    listings.find((err, data) => {
        if (!err && data) {
            data.forEach( row => {
                newLocations.push(row.addressLine1)
            })
            client
            .distancematrix({
                params: {
                origins: ["Cambridge Centre"],
                destinations: newLocations,
                key: process.env.GEOCODER_API_KEY
                },
                timeout: 1000 // milliseconds
            })
            .then(async function (r) {
                let i = 0
                r.data.rows[0].elements.forEach( e => {
                    if(e.status == "OK") {
                        if(e.distance.value < 10000) {
                            locations.push(newLocations[i])
                        }
                    }
                    i++
                })
                console.log(locations)
                await getLocations(locations).then(loc => {
                    res.render("mapDistance", {mapsData: mapsData, markers: loc})
                })
            })
            .catch(e => {
                console.log(e)
            });
        }
    })
    
})


router.get('/:location', middlewareObj.isLoggedIn, (req, res) => {
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
        res.render("maps", {mapsData: mapsData, alert: true, alerts: alerts})
    })
    
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
        res.render("maps", {mapsData: mapsData, alert: true, alerts: alerts})
    })
})



async function getLocations(locations) {
    return new Promise (async function(promise) {
        var returnArray = []
        for(const element of locations) {
            var value = await getLatLng(element)
            returnArray.push(value)
        }
        promise(returnArray)
    })
}

function getLatLng(location) {
    return new Promise ( promise => {
        geocoder.geocode(location, function (err, data) {
            if (err || !data.length) {
              console.log(err)
            }
            if (data.length) {     
                promise([data[0].latitude, data[0].longitude])
            }
        })
    })
}


module.exports = router