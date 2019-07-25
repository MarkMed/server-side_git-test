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

	if(!signedCookies.user){
		// Check if exist the user property setted in the signedCookie	or the signedCookie itself is already installed, if null, it...

		const authorizationHeader = req.headers.authorization;
		// ...challenge the user to authenticate and save authenticate info from the header when user submit...
		if(!authorizationHeader){
		// ...it checks if the authorizationHeader has value or not. If null...
			const err = new Error("You are not authenticated. Please, log in your account, or create one.");
			res.setHeader("WWW-Authenticate", "Basic");
			err.status = 401;
			// ...it ends the function and retunr an error...
			return next(err);
		}
		//...else if authorizationHeader has value, it analize the value wich coms within authorizationHeader...
		const authorization = new Buffer(authorizationHeader.split(" ")[1], "base64").toString().split(":");
		const username = authorization[0];
		const password = authorization[1];
		//...saves in variables for better understanding...

		if(username === "markmed" && password === "accessMkMServer4"){
		//...checks if values are valid. If are valid...
			res.cookie("user", "markmed", {signed: true});
			//...set the cookie with info and sign it...
			return next();
		}
		else{
			//...else... SEGUIR CON EXPLICACIÓN
			const err = new Error("Wrong username or password");
			res.setHeader("WWW-Authenticate", "Basic");
			err.status = 401;
			return next(err);
		}
	}
	else{ // ...else 
		if(signedCookies.user === "markmed"){
			return next();
		}
		else{
			const err = new Error("You are not authenticated. Please, log in your account, or create one.");
			err.status = 401;
			return next(err);
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
