// modules exports and const definitions
const express = require("express");
const bodyParser = require("body-parser");
const promotionsRouter = express.Router();
promotionsRouter.use(bodyParser.json());
const mongoose = require("mongoose");
const Promotions = require("../models/Promotions");
const authenticate = require("../authenticate");

// global endpoint
promotionsRouter.route("/")
.get((req, res, next)=>{
	console.log("\n\nGetting the whole list of Promotions:\n")
	Promotions.find({})
		.then((data)=>{
			if(data){
				res.statusCode = 200;
				res.setHeader("Content-type", "application/json");
				res.json(data);
			}
			else{
				err = new Error(`/promotions not found.`);
				err.status = 404;
				return next(err);
			}
		}, (err) => next(err))
		.catch((err)=>{
			console.error("Error in get >>> ", err);
		});
})
.post(authenticate.verifyUser, (req, res, next)=>{	
	if(authenticate.verifyAdmin(req)){
		Promotions.create(req.body)
		.then((data)=>{
			res.statusCode = 200;
			res.setHeader("Content-type", "application/json");
			res.json(data);
			console.log("\nNew promotion added:\n", data);
		}, (err) => next(err))
		.catch((err)=>{
			Promotions.remove({});
			console.error("Error in post >>> ", err);
		});
	}
	else {
		res.statusCode = 403;
		res.end("You account does not have the privileges to do this operation.");
	}
})
.put(authenticate.verifyUser, (req, res, next)=>{
	res.statusCode = 403;
	res.end("PUT opartion is forbidden on /promotions");
})
.delete(authenticate.verifyUser, (req, res, next)=>{
	if(authenticate.verifyAdmin(req)){
		Promotions.remove({})
		.then((resp)=>{
			console.log("\n\nDeleting all instances.\n");
			res.statusCode = 200;
			res.json(resp);
			console.log("\n\nAll instances has been deleted.\n");
		}, (err) => next(err))
		.catch((err)=>{
			console.error("Error in delete >>> ", err);
		});
	}
	else {
		res.statusCode = 403;
		res.end("You account does not have the privileges to do this operation.");
	}
});

// endpoint with id
promotionsRouter.route("/:promotionId")
.get((req, res, next)=>{
	const promotionId = req.params.promotionId;
	console.log("\n\nGetting the promotion with id: "+promotionId);
	Promotions.findById(promotionId)
		.then((data)=>{
			if(data){
				res.statusCode = 200;
				res.setHeader("Content-type", "application/json");
				res.json(data);
			}
			else{
				err = new Error(`Promotion #${promotionId} not found.`);
				err.status = 404;
				return next(err);
			}
		}, (err) => next(err))
		.catch((err)=>{
			console.error("Error in get /id >>> ", err);
		});
})
.post(authenticate.verifyUser, (req, res, next)=>{
	res.statusCode = 403;
	res.end("POST opartion is forbidden on an already existing resource.");
})
.put(authenticate.verifyUser, (req, res, next)=>{
	if(authenticate.verifyAdmin(req)){
		const promotionId = req.params.promotionId;
		console.log("\n\nUpdating the promotion with id: "+promotionId);
		Promotions.findById(promotionId)
		.then((data)=>{
			if(data){
				Promotions.findByIdAndUpdate(
					promotionId, 
					{
						$set: req.body
					},
					{
						new: true
					}
				)
				.then((data)=>{
					res.statusCode = 200;
					res.setHeader("Content-type", "application/json");
					res.json(data);
				}, (err) => next(err));
			}
			else{
				err = new Error(`Promotion #${promotionId} not found.`);
				err.status = 404;
				return next(err);
			}
		}, (err) => next(err))
		.catch((err)=>{
			console.error("Error in put /id >>> ", err);
		});
	}
	else {
		res.statusCode = 403;
		res.end("You account does not have the privileges to do this operation.");
	}
})
.delete(authenticate.verifyUser, (req, res, next)=>{
	if(authenticate.verifyAdmin(req)){
		const promotionId = req.params.promotionId;
		console.log("\n\nDeleting the promotion with id: "+promotionId);
		Promotions.findById(promotionId)
		.then((data)=>{
			if(data){
				Promotions.findByIdAndRemove(promotionId)
				.then((data)=>{
					res.statusCode = 200;
					res.setHeader("Content-type", "application/json");
					res.json(data);
				}, (err) => next(err));
			}
			else{
				err = new Error(`Promotion #${promotionId} not found.`);
				err.status = 404;
				return next(err);
			}
		}, (err) => next(err))
		.catch((err)=>{
			console.error("Error in get /id >>> ", err);
		});
	}
	else {
		res.statusCode = 403;
		res.end("You account does not have the privileges to do this operation.");
	}
});

module.exports = promotionsRouter;