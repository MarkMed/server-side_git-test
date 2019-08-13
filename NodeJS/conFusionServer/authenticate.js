const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const userModel = require("./models/user");
const jwtPassport = require("passport-jwt");
const jwtStrategy = jwtPassport.Strategy;
const extractJwt = jwtPassport.ExtractJwt;
const jwt = require("jsonwebtoken");
const configJS = require("./config");
const facebookTokenStrategy = require("passport-facebook-token");


exports.local = passport.use(new localStrategy(userModel.authenticate()));
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

exports.getToken = (user)=>{
	//Here creates the token
	return jwt.sign(user, configJS.secretKey, {expiresIn: "6h"})
}
const opts = {};
opts.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = configJS.secretKey;

function verifUser(jwt_payload, done){
	console.log("Running user verification");
	console.log("\nJWT Payload: ", jwt_payload);
	userModel.findOne({_id: jwt_payload._id}, (err, userData)=>{
		if(err){
			console.log("err", err);
			return done(err, false)
		}
		else if(userData){
			console.log(userData);
			return done(null, userData)
		}
		else{
			return done(null, false);
		}
	});
}

exports.jwtPassport = passport.use(new jwtStrategy(opts, verifUser));

exports.verifyUser = passport.authenticate("jwt", {session: false});
exports.verifyAdmin = (req, res, next)=>{
	console.log("Running admin verification");
	if (req.user.admin){
		next();
	}
	else{
		err = new Error("You account does not have the privileges to do this operation or access here.");
		err.status = 403;
		next(err)
	}
}

exports.facebookPassport = passport.use(
	new facebookTokenStrategy(
		{
			clientID: configJS.facebook.clientId,
			clientSecret: configJS.facebook.clientSecret
		},
		(accessToken, refreshToken, profile, done)=>{
			console.log("Searching for registered users");
			userModel.findOne({facebookId: profile.id}, (err, user)=>{ // Will search users registered with FB using the given id
				if(err){ // If there is some error in the finding
					console.log("Error finding FB user");
					return done(err, false) // return error
				}
				else{ // If there is not error in the finding
					if(user){ // it evaluates if the user is not null or undefined
						console.log("FB user found!");
						return done(null, user) // if user exist, return user
					}
					else{ // if user does not exist, create user
						console.log("FB user not found... Creating one");
						user = new userModel({
							username: profile.displayName
						});
						user.facebookId = profile.id;
						user.firstname = profile.name.givenName;
						user.lastname = profile.name.familyName;
						user.save((err, user)=>{
							if(err){
								console.log("Error creating FB User");
								return done(err, false)
							}
							else{
								console.log("FB User succefully created")
								return done(null, user);
							}
						});
					}
				}
			})
		}
	)
);