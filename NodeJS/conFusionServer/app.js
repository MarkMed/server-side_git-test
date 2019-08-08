const createError = require('http-errors');
const express = require('express');
const path = require('path');
const mongoose = require("mongoose");
const session = require("express-session");
const fileStore = require("session-file-store")(session);
const passport = require("passport");
const authenticate = require("./authenticate");
const configFile = require("./config");

// const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const dishesRouter = require("./routes/dishRouter");
const leadersRouter = require("./routes/leaderRouter");
const promotionsRouter = require("./routes/promoRouter");
const uploadRouter = require("./routes/uploadRouter");

const connect = mongoose.connect(configFile.mongoUrl);

connect
.then((db)=>{
	console.log("Succefully connected to the server!");
})
.catch((err)=>{
	console.error(err);
});

const app = express();

app.all("*", (req, res, next)=>{
	if(req.secure){
		return next();
	}
	else{
		return res.redirect(307, `https://${req.hostname}:${app.get("securePort")}${req.url}`)
	}
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser("0419-0809-2000-1998"));
// app.use(session({
// 	name: "mySession",
// 	resave: false,
//     saveUninitialized: false,
// 	secret: "0419-0809-1998-2000",
//     store:  new fileStore()
// }));

app.use(passport.initialize());
// app.use(passport.session());

// function getAuthorization(req, res, next){
// 	const reqSession = req.session;
// 	// const reqHeaders = req.headers;
// 	// const signedCookie = req.signedCookies;
// 	console.log(reqSession);
// 	console.log("\n__________________________________________________\n");
// 	console.log("\nChecking if exist a session with user property setted\n");

// 	if(!req.user){
// 		// Checks if exist the user property setted in the signedCookie	or if the signedCookie itself is already installed. If null, it...
// 		console.log("\nNo reqSession\n");
// 		console.log("\nchecking if the authorizationHeader has value...\n");
// 		console.log("\nauthorizationHeader has not value\n");
// 		const err = new Error("You are not authenticated. Please, log in your account, or create one.");
// 		err.status = 403;
// 		console.log("\n__________________________________________________\n");
// 		// ...it ends the function and returns an error...
// 		return next(err);
// 	}
// 	else{
// 		next();
// 	}
// }
// app.use(getAuthorization);

app.use(express.static(path.join(__dirname, 'public')));

// EndPoints
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/dishes", dishesRouter);
app.use("/leaders", leadersRouter);
app.use("/promotions", promotionsRouter);
app.use("/uploadImage", uploadRouter)

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
