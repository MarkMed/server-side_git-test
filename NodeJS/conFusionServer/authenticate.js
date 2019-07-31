const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const userModel = require("./models/user");
const jwtPassport = require("passport-jwt");
const jwtStrategy = jwtPassport.Strategy;
const extractJwt = jwtPassport.ExtractJwt;
const jwt = require("jsonwebtoken");
const configJS = require("./config");


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

function verifCallback(jwt_payload, done){
    console.log("\nJWT Payload: ", jwt_payload);
    userModel.findOne({_id: jwt_payload._id}, (err, userData)=>{
        if(err){
            return done(err, false)
        }
        else if(userData){
            return done(null, userData)
        }
        else{
            return done(null, false);
        }
    });
}

exports.jwtPassport = passport.use(
    new jwtStrategy(opts, verifCallback)
);

exports.verifyUser = passport.authenticate("jwt", {session: false});

