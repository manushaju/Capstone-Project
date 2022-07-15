const express = require('express')
const router = express.Router()
const users = require('../models/User')
const bcrypt = require('bcrypt')

router.get('/', (req, res) => {
    res.render("login")
})

router.post('/', (req, res) => {
    users.findOne({userName: req.body.userName}, (err, data) => {
        if (err) { console.log(err)}
        else {
            if(data){
                bcrypt.compare(req.body.password, data.password, (err, result) => {
                    if(result){
                        req.session.authenticated = true
                        req.session.username = req.body.userName
                        res.render('home', {
                            tempData: "",
                            userName: req.session.username,
                            loggedIn: req.session.authenticated
                        })
                    } else {
                        res.render('login', {tempData: "password is incorrect"})
                    }
                    
                })
            }
            else {
                res.render('login', {tempData: "User not registered"})
            }
        }
    })
})



router.get('/logout')


module.exports = router