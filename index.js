//including dependancies
var express = require('express');
var path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');

//
const {
    check,
    validationResult
} = require('express-validator');

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
    saveUninitialized: true,
}));

const databaseConn = 'mongodb://localhost:27017/blogDB';
// To connect to the database - todoDB
mongoose.connect(databaseConn, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});



app.get('/', function(req, res){
	res.send("<h1>Hello world</h1>");
});


app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
