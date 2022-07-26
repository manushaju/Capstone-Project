const express = require('express')
const router = express.Router()
const NodeGeocoder = require('node-geocoder')
const alerts = require('../data/alerts')
let mapsData = require('../data/mapsData')
let middlewareObj = require('../middleware/index')
let listings = require('../models/listing')
let bookings = require('../models/booking')
let {getValidBookings} = require('../data/databaseQueries')
//for adding Distance Calculations
const Client  = require('@googlemaps/google-maps-services-js').Client

const client = new Client({
    key: process.env.GEOCODER_API_KEY
})


// Setup Geocoder options
let options = {
    provider: "google",
    httpAdapter: "https",
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
}

let geocoder = NodeGeocoder(options)

router.get('/difference', async (req, res) => {
    let data = await getValidBookings()
    console.log("*********")
    console.log(data[0].bookingDetails.length)
    res.send({value: data[0]})
})

router.get('/', async function(req, res)  {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const urlParams = new URLSearchParams(req._parsedOriginalUrl.search)
    let inputVal = {
        location: "",
        fromDate: `${today.getFullYear()}-${String(today.getMonth()).padStart(2, '0')}-${today.getDate()}`,
        toDate: `${tomorrow.getFullYear()}-${String(tomorrow.getMonth()).padStart(2, '0')}-${tomorrow.getDate()}`,
        fromTime: "12:00",
        toTime: "12:00"
    }
    if(urlParams.get('location') > "") {
        inputVal.location = urlParams.get('location')
    }
    if(urlParams.get('fromDate') > "") {
        inputVal.fromDate = urlParams.get('fromDate')
    }
    if(urlParams.get('toDate') > "") {
        inputVal.toDate = urlParams.get('toDate')
    }
    if(urlParams.get('fromTime') > "") {
        inputVal.fromTime = urlParams.get('fromTime')
    }
    if(urlParams.get('toTime') > "") {
        inputVal.toTime = urlParams.get('toTime')
    }
    geocoder.geocode(inputVal.location, function (err, data) {
        if (err || !data.length) {
          alerts.data = "Invalid address, try again"
          alerts.type = "danger"
          res.render("searchPage", {alert: true, alerts: alerts, markers:[[]], inputVal: inputVal})
        } else if (data.length) {
            let eligibleLocations = []
            let locations = []
            let locationsData = []
            let locationsDataTemp = []
            listings.find((err, data) => {
                if (!err && data) {
                    data.forEach( row => {
                        // Add code for availability check here...
                        eligibleLocations.push(row.addressLine1)
                        locationsDataTemp.push(row)                        
                    })
                    client
                    .distancematrix({
                        params: {
                        origins: [inputVal.location],
                        destinations: eligibleLocations,
                        key: process.env.GEOCODER_API_KEY
                        },
                        timeout: 1000
                    })
                    .then(async function (r) {
                        let i = 0
                        r.data.rows[0].elements.forEach( e => {
                            if(e.status == "OK") {
                                if(e.distance.value < 10000) {
                                    locations.push(eligibleLocations[i])
                                    // locationsData.push({locationsDataTemp[i]})
                                    locationsData.push({
                                        _id: locationsDataTemp[i]._id,
                                        addressLine1: locationsDataTemp[i].addressLine1,
                                        images: locationsDataTemp[i].images,
                                        hourlyRate: locationsDataTemp[i].hourlyRate,
                                        distance: e.distance.value,
                                    })
                                }
                            }
                            i++
                        })
                        await getLocations(locations).then(loc => {
                            if(loc.length > 0){
                                req.session.fromDate = inputVal.fromDate
                                req.session.toDate = inputVal.toDate
                                req.session.fromTime = inputVal.fromTime
                                req.session.toTime = inputVal.toTime
                                res.render("searchPage", {markers: loc, listings: locationsData, inputVal: inputVal})
                            } else {
                                alerts.data = "No listings in 10KM radius of your selection, try a diffrent location"
                                alerts.type = "danger"
                                res.render("searchPage", {alert: true, alerts: alerts, markers:[[]], inputVal: inputVal})
                            }
                            
                        })
                    })
                    .catch(e => {
                        alerts.data = e
                        alerts.type = "danger"
                        res.render("searchPage", {alert: true, alerts: alerts, markers:[[]], inputVal: inputVal})
                    });
                    }
                })
        }  
    })
}) 


router.get('/distance', async function(req, res)  {
    let eligibleLocations = []
    let locations = []
    listings.find((err, data) => {
        if (!err && data) {
            data.forEach( row => {
                eligibleLocations.push(row.addressLine1)
            })
            client
            .distancematrix({
                params: {
                origins: ["Cambridge Centre"],
                destinations: eligibleLocations,
                key: process.env.GEOCODER_API_KEY
                },
                timeout: 1000 // milliseconds
            })
            .then(async function (r) {
                let i = 0
                r.data.rows[0].elements.forEach( e => {
                    if(e.status == "OK") {
                        if(e.distance.value < 10000) {
                            locations.push(eligibleLocations[i])
                        }
                    }
                    i++
                })
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
        let returnArray = []
        for(const element of locations) {
            let value = await getLatLng(element)
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