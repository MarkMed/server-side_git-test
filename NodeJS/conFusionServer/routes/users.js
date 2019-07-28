const express = require('express');
const userRouter = express.Router();
const userModel= require("../models/user");

/* GET users listing. */
userRouter.route("/")
.get((req, res, next)=>{
	res.send('respond with a resource');
});
userRouter.route("/signup")
.post((req, res, next)=>{
	const reqBody = req.body
	userModel.findOne({username: reqBody.username})
	.then((data) => {
		if(data != null) {
		  var err = new Error('User ' + reqBody.username + ' already exists!');
		  err.status = 403;
		  next(err);
		}
		else {
		  return userModel.create({
			username: reqBody.username,
			password: reqBody.password});
		}
	  })
	.then((data)=>{
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json({status: 'Registration Successful!', user: data});
	}, (err)=>{
		next(err)
	})
	.catch((err)=>{
		next(err);
	})
});
userRouter.route("/login")
.post((req, res, next)=>{
	const reqSession = req.session;
	const reqHeaders = req.headers;
	if(!reqSession.user){
		// Checks if exist the user property setted in the session or if the session itself is exist. If null or undefined, it...
		console.log("\nNo reqSession\n");
		console.log("\nchecking if the authorizationHeader has value...\n");
		const authorizationHeader = reqHeaders.authorization;
		// ...challenge the user to authenticate and save the authenticate info from the header, when user submit...
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
		const username = authorization[0]; // username that user has introduce
		const password = authorization[1]; // password that user has introduce
		// ...saves in variables for better understanding and managing...

		console.log("\nchecking if values are corrects...\n");
		userModel.findOne({username: username})		
		// ...search and return in the DB for a instance of user with the username passed through the authorizationHeader...
		.then((data)=>{
			if(!data){
				// ...if it does not found anything, it returns an error...
				console.log("\nYou are not authenticated\n");
				const err = new Error(`You are not authenticated. Please create an account.`);
				res.setHeader("WWW-Authenticate", "Basic");
				err.status = 403;
				return next(err);
			}
			else{
				// ...else, it meaning that the user instances has been found, so...
				// ...it checks if the properties in the user instances has the values that was passed through the authorizationHeader...
				if(data.password !== password || data.username !== username){
					// ...if the values that was passed through the authorizationHeader are incorrect it returns an error...
					console.log("\nThe authorizationHeader values are incorrect\n");
					const err = new Error("Incorrect username or password");
					res.setHeader("WWW-Authenticate", "Basic");
					err.status = 403;
					return next(err);
				}
				else{
					// ...else, the values that was passed through the authorizationHeader are correct, and it start the session...
					console.log("\nthe authorizationHeader has the correct values!\n");
					console.log("\nSetting up the reqSession!\n");
					reqSession.user = "authenticated"
					console.log("\nreqSession set!\n");
					console.log("\n__________________________________________________\n");
					//...set the session cookie with info and sign it...
					res.statusCode = 200;
					res.setHeader("Content-type", "application/json");
					
					res.json({
						status: "Login Successful",
						user: data
					});
				}
			}
		}, (err)=>{
			next(err)
		})
		.catch((err)=>{
			next(err);
		})
	}
	else{
		// ...else, if exist the user property setted in the signedCookie or if the signedCookie itself is already installed...
		console.log("\nreqSession Exist!\n");
		console.log("\nchecking username...\n");
		res.statusCode = 200;
		res.setHeader("Content-type", "text/plain");
		res.end("You are already authenticated")
	}
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
