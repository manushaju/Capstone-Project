const express = require('express')
const router = express.Router()
const users = require('../models/User')

router.get('/' , (req, res) => {
    users.find( (err, data) => {
        if (err) {
            console.log("Error in fetching data")
        } else {
            if (data) {
                res.render('profiles', {users: data})
            }
        }
    })
})

module.exports = router