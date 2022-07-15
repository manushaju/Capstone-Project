const { application } = require('express')
const express = require('express')
const router = express.Router()
const fileUpload = require('express-fileupload')
const listings = require('../models/listing')
var alerts = require('../data/alerts')
const NodeGeocoder = require('node-geocoder');
// Setup Geocoder options
var options = {
    provider: "google",
    httpAdapter: "https",
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
}

var geocoder = NodeGeocoder(options)

router.use(fileUpload())
var imageArray = []

var listing = {
    addressLine1: "",
    addressLine2: "",
    city: "",
    province: "",
    zipcode: "",
    phone: "",
    images: null,
    hourlyRate: "",
    monthlyRate: "",
}

router.get('/', (req, res) =>{
    res.render('addListing', {listing: listing})
})

router.get('/list', (req, res) => {
    listings.find( (err, data) => {
        if(!err && data) {
            res.render("allListings", {listings: data})
        }
    })
})

router.post('/', (req, res) => {
    listings.findOne({addressLine1: req.body.addressLine1}, (err, data) => {
        if(err) {
            console.log(err)
            res.render("addListing", {listing: req.body})
        } else {
            if(!data) {
                geocoder.geocode(req.body.addressLine1, (geoerr, geodata) =>{
                    if(geoerr || !geodata.length) {
                        alerts.data = "Invalid address, please enter a valid one"
                        alerts.type = "danger"
                        res.render("addListing", {listing: req.body})
                    }
                })
                const newListing = new listings(req.body)
                newListing.images = []

                if (req.files.images.length > 0) {
                    req.files.images.forEach( (image) => {
                        newListing.images.push(image)
                    } )
                } else {
                    newListing.images.push(req.files.images)
                }
                newListing.save().then( () => {
                    alerts.data = "Listing added successfully"
                    alerts.type = "success"
                    res.render('home', {alert: true, alerts: alerts})
            })
            } else {
                alerts.data = "Address already present in the database"
                alerts.type = "danger"
                res.render("addListing", {listing: req.body, alert: true, alerts: alerts })
            }
        }
    })
    
})

module.exports = router