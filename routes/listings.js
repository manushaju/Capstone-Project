const { application } = require('express')
const express = require('express')
const router = express.Router()
const fileUpload = require('express-fileupload')
const listings = require('../models/listing')
var alert = require('../data/alerts')

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
    alert.data = "THis is a temp alert"
    alert.type = "danger"
    res.render('addListing', {listing: listing, alert:true, alerts: alert, })
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
            res.redirect('/')
        } else {
            if(!data) {
                const newListing = new listings(req.body)
                imageArray.push(req.files.images)
                imageArray.forEach( (image) => {
                    newListing.images.push({
                        data: image.data,
                        contentType: image.mimetype,
                    })
                })
                newListing.save().then( () => {
                res.redirect('/')
            })
            } else {
                res.redirect('/')
            }
        }
    })
    
})

module.exports = router