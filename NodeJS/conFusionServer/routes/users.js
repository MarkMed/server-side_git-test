const express = require('express');
const bodyParser = require("body-parser");
const userRouter = express.Router();
userRouter.use(bodyParser.json());
const userModel= require("../models/user");
const passport = require("passport");
const authenticate = require("../authenticate");

/* GET users listing. */
userRouter.route("/")
.get(authenticate.verifyUser, (req, res, next)=>{	
	if(authenticate.verifyAdmin(req)){
		userModel.find({})
		.then((data)=>{
			if(data){
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.json(data);
			}
			else{
				err = new Error("/users not found.");
				err.status = 404;
				return next(err);
			}
		}, err => next(err))
		.catch((err)=>{
			console.log("Error getting /users >>> ", err)
		});
	}
	else {
		res.statusCode = 403;
		res.end("You cannot acces here. Contact with a <a href='/'>admin</a>");
	}
});
userRouter.route("/signup")
.post((req, res, next)=>{ 
	// User registration
	const reqBody = req.body
	userModel.register(new userModel({username: reqBody.username}), reqBody.password, (err, data) => {
		if(err) {
			console.log("Error in creating user");
			res.statusCode = 500;
			res.setHeader('Content-Type', 'application/json');
			res.json({err: err});
			return;
		}
		else {
			console.log("Creating user");
			console.log(reqBody.firstname, reqBody.lastname);
			if(reqBody.firstname){
				data.firstname = reqBody.firstname
			}
			if(reqBody.lastname){
				data.lastname = reqBody.lastname
			}
			data.save((err, data)=>{
				if(err){
					console.log("Error Editing user");
					res.statusCode = 500;
					res.setHeader('Content-Type', 'application/json');
					res.json({err: err});
					return;
				}
				console.log("User created!");
				passport.authenticate("local")(req, res, ()=>{
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json({success: true, status: 'Registration Successful!', user: data});
				});
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
