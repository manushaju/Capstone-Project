const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render("index", {tempData: "Hello world"})
})

router.get('/:uname', (req, res) => {
    console.log(req.session)
    // console.log(req)
    res.render("index", {tempData: req.params.uname})
})

module.exports = router