// modules exports and const definitions
const express = require("express");
const bodyParser = require("body-parser");
const promotionsRouter = express.Router();
promotionsRouter.use(bodyParser.json());
const mongoose = require("mongoose");
const Promotions = require("../models/Promotions");
const authenticate = require("../authenticate");
const corsRouter = require("./corsRoute");

// global endpoint
promotionsRouter.route("/")
.options(corsRouter.corsWithOptions, (req, res)=>{ 	res.sendStatus(200); })
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
.post(corsRouter.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
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
})
.put(corsRouter.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{
	res.statusCode = 403;
	res.end("PUT opartion is forbidden on /promotions");
})
.delete(corsRouter.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
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
});

// endpoint with id
promotionsRouter.route("/:promotionId")
.options(corsRouter.corsWithOptions, (req, res)=>{ 	res.sendStatus(200); })
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
.post(corsRouter.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{
	res.statusCode = 403;
	res.end("POST opartion is forbidden on an already existing resource.");
})
.put(corsRouter.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
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
})
.delete(corsRouter.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
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
});

module.exports = promotionsRouter;