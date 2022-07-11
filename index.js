//including dependancies
var express = require('express');
var path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const userRouter = require('./routes/users');

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


// Using Routes in the application
app.use('/users', userRouter)


app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
    
}));


const databaseConn = 'mongodb+srv://manu_shaju_mongo:626688@cluster0.rgqoc.mongodb.net/tempDB';
mongoose.connect(databaseConn, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//Databases


app.get('/', (req, res) => {
  res.render('home', {tempData: "This is home page"});
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


// console.log("Inside already \n" + req.session)
// if(req.session.authenticated){ 
//     res.render("index", {tempData: "Hello world"})
// } else if(req.params.uname == "manu") {
//     console.log("Correct!!!!")
//     req.session.authenticated = true
//     req.session.username = req.params.uname
//     res.send(req.session)
// }