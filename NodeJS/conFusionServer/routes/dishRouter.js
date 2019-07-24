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
			if(!!data){
				res.statusCode = 200;
				res.setHeader("Content-type", "application/json");
				res.json(data);
			}
			else{
				err = new Error(`/dishes not found.`);
				err.status = 404;
				return next(err);
			}
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
	const dishId = req.params.dishId;
	console.log("\n\nGetting the dishe: with id: "+dishId);
	Dishes.findById(dishId)
		.then((data)=>{
			if(!!data){
			
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(data);
			}
			else{
				err = new Error(`Dish ${dishId} not found.`);
				err.status = 404;
				return next(err);
			}
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
	const dishId = req.params.dishId;
	console.log("\n\nUpdating the dish with id: "+dishId);
	Dishes.findById(dishId)
		.then((data)=>{
			if(!!data){
				Dishes.findByIdAndUpdate(
					dishId, 
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
				err = new Error(`Dish #${dishId} not found.`);
				err.status = 404;
				return next(err);
			}
		}, (err) => next(err))
		.catch((err)=>{
			console.error("Error in put /id >>> ", err);
		});
})
.delete((req, res, next)=>{
	const dishId = req.params.dishId;
	console.log("\n\nDeleting the dish with id: "+dishId);
	
	Dishes.findById(dishId)
		.then((data)=>{
			if(!!data){
				Dishes.findByIdAndRemove(dishId)
				.then((data)=>{
					res.statusCode = 200;
					res.setHeader("Content-type", "application/json");
					res.json(data);
				}, (err) => next(err));
			}
			else{
				err = new Error(`Dish #${dishId} not found.`);
				err.status = 404;
				return next(err);
			}
		}, (err) => next(err))
		.catch((err)=>{
			console.error("Error in get /id >>> ", err);
		});
});

// global comment endpoint
dishesRouter.route("/:dishId/comments")
.get((req, res, next)=>{
	console.log("\n\nGetting the whole list of dishes:\n")
	Dishes.findById(req.params.dishId)
		.then((data)=>{
			if(data != null){
				res.statusCode = 200;
				res.setHeader("Content-type", "application/json");
				console.log(data.comments[0]);
				res.json(data.comments);
			}
			else{
				err = new Error(`Dish ${req.params.dishId} not found.`);
				err.status = 404;
				return next(err);
			}
		}, (err) => next(err))
		.catch((err)=>{
			console.error("Error in get >>> ", err);
		});
})
.post((req, res, next)=>{
	Dishes.findById(req.params.dishId)
	.then((data)=>{
		if(data != null){
			data.comments.push(req.body);
			data.save()
			.then((data)=>{
				res.statusCode = 200;
				res.setHeader("Content-type", "application/json");
				res.json(data);
			})
		}
		else{
			err = new Error(`Dish ${req.params.dishId} not found.`);
			err.status = 404;
			return next(err);
		}
	}, (err) => next(err))
	.catch((err)=>{
		Dishes.remove({});
		console.error("Error in post >>> ", err);
	});
})
.put((req, res, next)=>{
	res.statusCode = 403;
	res.end("PUT opartion is forbidden on /dishes" + req.params.dishId + "/comments");
})
.delete((req, res, next)=>{
	Dishes.findById(req.params.dishId)
	.then((data)=>{
		if(data != null){
			data.comments = [];
			data.save()
			.then((data)=>{
				res.statusCode = 200;
				res.setHeader("Content-type", "application/json");
				res.json(data);
			})
		}
		else{
			err = new Error(`Dish ${req.params.dishId} not found.`);
			err.status = 404;
			return next(err);
		}
	}, (err) => next(err))
	.catch((err)=>{
		console.error("Error in delete >>> ", err);
	});
});

// endpoint with comment id
dishesRouter.route("/:dishId/comments/:commentId")
.get((req, res, next)=>{
	console.log("\n\nGetting the dishe: with id: "+req.params.dishId);
	Dishes.findById(req.params.dishId)
		.then((data)=>{
			const commentObj = data.comments.id(req.params.commentId);
			if(data != null){
				if(commentObj != null){
					res.statusCode = 200;
					res.setHeader("Content-type", "application/json");
					res.json(commentObj);
				}
				else{
					err = new Error(`Comment ${req.params.commentId} not found.`);
					err.status = 404;
					return next(err);
				}
			}
			else{
				err = new Error(`Dish ${req.params.dishId} not found.`);
				err.status = 404;
				return next(err);
			}
		}, (err) => next(err))
		.catch((err)=>{
			console.error("Error in get /id >>> ", err);
		});
})
.post((req, res, next)=>{
	res.statusCode = 403;
	res.end("POST opartion is forbidden on an already existing comment.");
})
.put((req, res, next)=>{
	console.log("\n\nUpdating the comment with id "+req.params.commentId+" of dish with id: "+req.params.dishId);
	
	Dishes.findById(req.params.dishId)
		.then((data)=>{
			const commentObj = data.comments.id(req.params.commentId);
			if(data != null){
				if(commentObj != null){
					const newRating = req.body.rating;
					const newComment = req.body.comment;
					if(newRating){
						commentObj.rating = newRating;
					}
					if(newComment){
						commentObj.comment = newComment;
					}
					data.save()
					.then((data)=>{
						res.statusCode = 200;
						res.setHeader("Content-type", "application/json");
						res.json(data);
					}, (err) => next(err));
					
				}
				else{
					err = new Error(`Comment ${req.params.commentId} not found.`);
					err.status = 404;
					return next(err);
				}
			}
			else{
				err = new Error(`Dish ${req.params.dishId} not found.`);
				err.status = 404;
				return next(err);
			}
		}, (err) => next(err))
		.catch((err)=>{
			console.error("Error in put /id >>> ", err);
		});
})
.delete((req, res, next)=>{
	console.log("\n\nDeleting the dish with id: "+req.params.dishId);
	Dishes.findById(req.params.dishId)
		.then((data)=>{
			const commentObj = data.comments.id(req.params.commentId);
			if(data != null){
				if(commentObj != null){
					commentObj.remove();
					data.save()
					.then((data)=>{
						res.statusCode = 200;
						res.setHeader("Content-type", "application/json");
						res.json(data);
					}, (err) => next(err));
				}
				else{
					err = new Error(`Comment ${req.params.commentId} not found.`);
					err.status = 404;
					return next(err);
				}
			}
			else{
				err = new Error(`Dish ${req.params.dishId} not found.`);
				err.status = 404;
				return next(err);
			}
		}, (err) => next(err))
		.catch((err)=>{
			console.error("Error in delete /id >>> ", err);
		});
});

module.exports = dishesRouter;