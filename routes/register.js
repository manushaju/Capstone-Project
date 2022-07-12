const express = require('express')
const router = express.Router()
const users = require('../models/User')
const bcrypt = require('bcrypt')
const saltRounts = 10;

router.get('/', (req, res) => {
    res.render('register', {tempData: ""})
})

router.post('/', (req, res) => {
    users.findOne({userName: req.body.userName}, (err, data) => {
        if(err) { console.log(err)}
        else {
            if(data){
                res.render("register", {tempData: `User ${req.body.userName} already present, please try with a different name.`})
            } else {
                bcrypt.hash(req.body.password, saltRounts, (err, hash) => {
                    const user = new users({
                        name: req.body.name,
                        addressLine1: req.body.addressLine1,
                        addressLine2: req.body.addressLine2,
                        phone: req.body.phone,
                        email: req.body.email,
                        userName: req.body.userName,
                        password: hash
                    })
                    user.save().then(() => {
                        res.render('home', {tempData: "User registered successfully"})
                    })
                })
            }         
        }
    })  
})

module.exports = router