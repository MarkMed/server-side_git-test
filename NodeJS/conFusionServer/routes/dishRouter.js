// modules exports and const definitions
const express = require("express");
const bodyParser = require("body-parser");
const dishesRouter = express.Router();
dishesRouter.use(bodyParser.json());
const mongoose = require("mongoose");
const Dishes = require("../models/dishes");

// global endpoint
dishesRouter.route("/")
.get((req, res, next)=>{
	console.log("\n\nGetting the whole list of dishes:\n")
	Dishes.find({})
		.then((data)=>{
			res.statusCode = 200;
			res.setHeader("Content-type", "application/json");
			res.json(data);
		}, (err) => next(err))
		.catch((err)=>{
			console.error("Error in get >>> ", err);
		});
})
.post((req, res, next)=>{
	Dishes.create(req.body)
	.then((dish)=>{
		res.statusCode = 200;
		res.setHeader("Content-type", "application/json");
		res.json(dish);
		console.log("\nNew dish added:\n", dish);
	}, (err) => next(err))
	.catch((err)=>{
		Dishes.remove({});
		console.error("Error in post >>> ", err);
	});
})
.put((req, res, next)=>{
	res.statusCode = 403;
	res.end("PUT opartion is forbidden on /dishes");
})
.delete((req, res, next)=>{
	Dishes.remove({})
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
dishesRouter.route("/:dishId")
.get((req, res, next)=>{
	console.log("\n\nGetting the dishe: with id: "+req.params.dishId);
	Dishes.findById(req.params.dishId)
		.then((data)=>{
			res.statusCode = 200;
			res.setHeader("Content-type", "application/json");
			res.json(data);
		}, (err) => next(err))
		.catch((err)=>{
			console.error("Error in get /id >>> ", err);
		});
})
.post((req, res, next)=>{
	res.statusCode = 403;
	res.end("POST opartion is forbidden on an already existing resource.");
})
.put((req, res, next)=>{
	console.log("\n\nGetting the dish with id: "+req.params.dishId);
	
	Dishes.findByIdAndUpdate(
		req.params.dishId, 
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
	}, (err) => next(err))
	.catch((err)=>{
		console.error("Error in put /id >>> ", err);
	});
})
.delete((req, res, next)=>{
	console.log("\n\nDeleting the dish with id: "+req.params.dishId);
	Dishes.findByIdAndRemove(req.params.dishId)
	.then((data)=>{
		res.statusCode = 200;
		res.setHeader("Content-type", "application/json");
		res.json(data);
	}, (err) => next(err))
	.catch((err)=>{
		console.error("Error in delete /id >>> ", err);
	});	
});

module.exports = dishesRouter;