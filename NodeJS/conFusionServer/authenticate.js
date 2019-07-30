const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const userModel = require("./models/user");

exports.local = passport.use(new localStrategy(userModel.authenticate()));
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());