const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render("index", {tempData: "asas world"})
})

router.get('/login', (req, res) => {
    console.log(req.session)
    //make DBCall here..
    if(req.body.userName == "manu" && req.body.password == "1234"){
        res.render('home', {tempData: `Welcome ${req.body.userName}`})
    } else {
        res.render('login', {userName: "", tempData:"Please enter the valid credentials"})
    }
    
})


module.exports = router