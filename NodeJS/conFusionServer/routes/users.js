const express = require('express');
const bodyParser = require("body-parser");
const userRouter = express.Router();
userRouter.use(bodyParser.json());
const userModel= require("../models/user");
const passport = require("passport");
const authenticate = require("../authenticate");

/* GET users listing. */
userRouter.route("/")
.get((req, res, next)=>{
	res.send('respond with a resource');
});
userRouter.route("/signup")
.post((req, res, next)=>{ 
	// User registration
	const reqBody = req.body
	userModel.register(new userModel({username: reqBody.username}), reqBody.password, (err, data) => {
		if(err) {
			res.statusCode = 500;
			res.setHeader('Content-Type', 'application/json');
			res.json({err: err});
		}
		else {
		  	passport.authenticate("local")(req, res, ()=>{
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json({success: true, status: 'Registration Successful!', user: data});
			});
		}
	});
});

userRouter.route("/login")
.post(passport.authenticate("local"), (req, res)=>{
	const reqUser = req.user
	const token = authenticate.getToken({_id: reqUser._id});
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	res.json({success: true, token: token, status: 'Login Successful!'});
});

userRouter.route("/logout")
.get((req, res)=>{
	const reqSession = req.session;
	if(reqSession){
		// Checks if exist a session opened...
		reqSession.destroy();
		// ...it close the session and delete all its information,...
		res.clearCookie("mySession")
		// ...it clears the cookie linked with the eliminated session...
		res.redirect("/");
		// ...and redirect to some page. In ths case it redirect to home page.
	}
	else{
		// If does not exist a session opened...
		const err = new Error(`You must login or create an account first`);
		err.status = 403;
		next(err);

	}
});
module.exports = userRouter;
