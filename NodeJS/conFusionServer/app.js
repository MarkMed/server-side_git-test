var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const dishesRouter = require("./routes/dishRouter");
const leadersRouter = require("./routes/leaderRouter");
const promotionsRouter = require("./routes/promoRouter");
const mongoose = require("mongoose");
const mongooseCurrency = require("mongoose-currency");
const Dishes = require("./models/dishes");
const url = "mongodb://localhost:27017/conFusion";
const connect = mongoose.connect(url);

connect
.then((db)=>{
	console.log("Succefully connected to the server!");
})
.catch((err)=>{
	console.error(err);
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("0419-0809-2000-1998"));

function getAuthorization(req, res, next){
	const reqHeaders = req.headers;
	const signedCookie = req.signedCookies;
	console.log(signedCookie);
	console.log("\n__________________________________________________\n");
	console.log("\nChecking if exist a signedCookie with user property setted\n");

	if(!signedCookie.user){
		// Checks if exist the user property setted in the signedCookie	or if the signedCookie itself is already installed. If null, it...

		console.log("\nNo signedCookie\n");
		console.log("\nchecking if the authorizationHeader has value...\n");
		const authorizationHeader = req.headers.authorization;
		// ...challenge the user to authenticate and save the authenticate info from the header when user submit...
		if(!authorizationHeader){
		// ...it checks if the authorizationHeader has value or not. If null...
			console.log("\nauthorizationHeader has not value\n");
			const err = new Error("You are not authenticated. Please, log in your account, or create one.");
			res.setHeader("WWW-Authenticate", "Basic");
			err.status = 401;
			console.log("\n__________________________________________________\n");
			// ...it ends the function and returns an error...
			return next(err);
		}
		console.log("\nauthorizationHeader has value!\n");
		//...else, if authorizationHeader has value, it analize the value wich comes within authorizationHeader...
		const authorization = new Buffer.from(authorizationHeader.split(" ")[1], "base64").toString().split(":");
		console.log("\nprocessing value...\n");
		const username = authorization[0];
		const password = authorization[1];
		//...saves in variables for better understanding...

		console.log("\nchecking if values are corrects...\n");
		if(username === "markmed" && password === "accessMkMServer4"){
			console.log("\nthe authorizationHeader has the correct values!\n");
			console.log("\nSetting up the cookie!\n");
		//...and checks if values are valid. If are valid...
			res.cookie("user", "markmed", {signed: true});
			console.log("\nCookie set!\n");
			console.log("\n__________________________________________________\n");
			//...set the cookie with info and sign it...
			return next();
		}
		else{
			console.log("\nthe authorizationHeader values are incorrect\n");
			//...else, it ends the function and returns an error...
			const err = new Error("Wrong username or password");
			res.setHeader("WWW-Authenticate", "Basic");
			err.status = 401;
			return next(err);
		}
	}
	else{
		console.log("\nsignedCookie Exist!\n");
		console.log("\nchecking username...\n");
		// ...else, if exist the user property setted in the signedCookie or if the signedCookie itself is already installed...
		if(signedCookie.user === "markmed"){
			console.log("\nHello "+ signedCookie.user+"!\n");
			// ...it checks if the user property setted in the signedCookie has the correct value...
			return next();
		}
		else{
			const err = new Error("You are not authenticated. Please, log in your account, or create one.");
			err.status = 401;
			console.log("\n__________________________________________________\n");
			return next(err);
			//...else, it ends the function and returns an error...
		}
	}
}
app.use(getAuthorization);
app.use(express.static(path.join(__dirname, 'public')));
app.use("/dishes", dishesRouter);
app.use("/leaders", leadersRouter);
app.use("/promotions", promotionsRouter);

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
