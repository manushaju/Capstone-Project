//including dependancies
var express = require('express');
var path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('cookie-session');
const userRouter = require('./routes/users');
const registerRouter = require('./routes/register');


var app = express();
//setting the paths for ejs and public folders
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({
    extended: false
}));
app.use(bodyParser.urlencoded({
    extended: true
}));



app.use(session({
    secret: 'mysecret',
    resave: false,
    httpOnly: true,
    maxAge: 30 *60 * 1000,
    saveUninitialized: true,
}));

// Using Routes in the application
app.use('/login', userRouter)
app.use('/register', registerRouter)

const databaseConn = 'mongodb+srv://manu_shaju_mongo:626688@cluster0.rgqoc.mongodb.net/tempDB';
mongoose.connect(databaseConn, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});



app.get('/', (req, res) => {
  res.render('home', {
    tempData: "",
    userName: req.session.username,
    loggedIn: req.session.authenticated
    });
})

app.get('/login', (req, res) => {
    res.render('login', {userName: "", tempData:""})
})

app.get('/register', (req, res) => {
    res.render('register', {tempData: ""})
})



app.post('/register', (req, res) => {
    console.log(req.body)
    res.render('home', {tempData: "You are registered in successfully"})
})

app.listen(process.env.PORT || 3500, function() {
  console.log("Server started on port 3500");
});

