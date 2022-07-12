const express = require('express')
const router = express.Router()
const users = require('../models/User')
const bcrypt = require('bcrypt')
const saltRounds = 10;

router.get('/', (req, res) => {
    res.render("login", {tempData: ""})
})

router.post('/', (req, res) => {
    users.findOne({userName: req.body.userName}, (err, data) => {
        if (err) { console.log(err)}
        else {
            if(data){
                bcrypt.compare(req.body.password, data.password, (err, result) => {
                    console.log("Input: " + req.body.password )
                    console.log("Database: " + data.password)
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

router.post('/login', (req, res) => {
    console.log(req.session)
    //make DBCall here..
    if(req.body.userName == "manu" && req.body.password == "1234"){
        req.session.isLoggedIn = true;
        res.render('home', {tempData: `Welcome ${req.body.userName}`})
    } else {
        res.render('login', {userName: "", tempData:"Please enter the valid credentials"})
    }
    
})


module.exports = router