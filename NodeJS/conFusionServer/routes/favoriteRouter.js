// modules exports and const definitions
const express = require("express");
const bodyParser = require("body-parser");
const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());
const mongoose = require("mongoose");
const corsRouter = require("./corsRoute");
const favoriteModel = require("../models/favorites");
const authenticate = require("../authenticate");

function forbiddenOper(res, operation, endpoint){
    res.statusCode = 403;
    res.end(`${operation} operation is forbidden on ${endpoint}`);
}

// global endpoint
favoriteRouter.route("/")
.get((req, res, next)=>{
    console.log(req.user._id);
	console.log("\n\nGetting the whole favorites list:\n")
	/*favoriteModel.find({})
	.populate("user")
	.populate("dishes")
	.then((data)=>{
		if(data){
			res.statusCode = 200;
			res.setHeader("Content-type", "application/json");
			res.json(data);
		}
		else{
			err = new Error(`/favorites not found.`);
			err.status = 404;
			return next(err);
		}
	}, (err) => next(err))
		.catch((err)=>{
		console.error("Error getting /favorites >>> ", err);
    });*/
    res.end(req.user._id);
})
.post(corsRouter.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{})
.put((req, res, next)=>{
    forbiddenOper(res, "PUT", "/favorites");
})
.delete(corsRouter.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{})

// endpoint with id
favoriteRouter.route("/:dishId")
.get((req, res, next)=>{
    forbiddenOper(res, "GET", "/favorites/:dishId");
})
.post(corsRouter.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{})
.put((req, res, next)=>{
    forbiddenOper(res, "PUT", "/favorites/:dishId");
})
.delete(corsRouter.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{})