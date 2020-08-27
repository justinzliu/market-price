var express = require('express'); //npm i express
var path = require('path');
var bodyParser = require('body-parser'); //npm i body-parser
var app = express();

//const hostname = '127.0.0.1';
const PORT = 3000;

var indexRouter = require('./routes/index');

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, 'views'));

//middleware
app.use(bodyParser.urlencoded({extended: true})) 
app.use(express.static(path.join(__dirname)))
app.use('/', indexRouter);

app.listen(PORT, function() {
	console.log("listening...");
});