// modules exports and const definitions
const express = require("express");
const bodyParser = require("body-parser");
const favoritesRouter = express.Router();
favoritesRouter.use(bodyParser.json());
const mongoose = require("mongoose");
const corsRouter = require("./corsRoute");
const favoriteModel = require("../models/favorites");
const authenticate = require("../authenticate");

function forbiddenOper(res, operation, endpoint){
	res.statusCode = 403;
	res.end(`${operation} operation is forbidden on ${endpoint}`);
}
function refreshDishesList(currentList, newItemList){ // Function that returns the new dishes added with the already
	console.log("currentList", currentList)
	console.log("newItemList", newItemList)
	const currentDishesList = currentList.sort((a,b)=>{return a-b});
	const incomingDishesList = newItemList.sort((a,b)=>{return a-b});
	const newDishes2Add = [];
	const list2Return = [];
	let i = 0;
	let j = 0;
	while((incomingDishesList[i]) && (currentDishesList[j])){
		if(incomingDishesList[i]._id < currentDishesList[j]){
			newDishes2Add.push(incomingDishesList[i]._id);
			i++;
		}
		else if(incomingDishesList[i]._id > currentDishesList[j]){
			j++;
		}
		else{
			i++;
			j++;
 		}
 	}
 	while(incomingDishesList[i]){
 		newDishes2Add.push(incomingDishesList[i]._id);
 		i++;
 	}
 	i = 0;
 	j = 0;
 	while((newDishes2Add[i]) && (currentDishesList[j])){
 		if(newDishes2Add[i] < currentDishesList[j]){
			list2Return.push(newDishes2Add[i]);
			i++;
		}
		else{
			list2Return.push(currentDishesList[j]);
			j++;
		}
	}
	while(newDishes2Add[i]){
		list2Return.push(newDishes2Add[i]);
		i++;
	}
	while(currentDishesList[j]){
		list2Return.push(currentDishesList[j]);
		j++;
	}
	console.log("list2Return", list2Return);
	return list2Return
}
// global endpoint
favoritesRouter.route("/")
.get(corsRouter.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{
	console.log("req.user._id >>>", req.user._id);
	console.log("\n\nGetting the whole favorites list:\n")
	favoriteModel.findOne({"user": (req.user._id)})
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
	});
})
.post(corsRouter.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{
	console.log(" req.user._id } ",  req.user._id);
	favoriteModel.findOne({"user": (req.user._id)})
	.then((data)=>{
		if(data){ // If does not exist the favorite list
			console.log("data >> ", data)
			data.dishes = refreshDishesList(data.dishes, req.body);
			data.save()
			.then((data)=>{
				favoriteModel.findById(data._id)
				.populate("user")
				.populate("dishes")
				.then((data)=>{
					res.statusCode = 200;
					res.setHeader("Content-type", "application/json");
					res.json(data);
				})
			}, (err) => next(err))
			.catch((err)=>{
				favoriteModel.remove({});
				console.error("Error in post new dishes in the list >>> ", err);
			});
		}
		else{ // If the favorite list already exist
			console.log("creating list")
			favoriteModel.create({
				"user": req.user._id,
				"dishes": req.body
			})
			.then((data)=>{
				favoriteModel.findById(data._id)
				.populate("user")
				.populate("dishes")
				.then((data)=>{
					console.log("\nNew favorite liste added:\n", data);
					res.statusCode = 200;
					res.setHeader("Content-type", "application/json");
					res.json(data);
				})
			}, (err) => next(err))
			.catch((err)=>{
				favoriteModel.remove({});
				console.error("Error in post >>> ", err);
			});
		}
	}, (err) => next(err))
	.catch((err)=>{
		console.error("Error posting /favorites >>> ", err);
	});
})
.put((req, res, next)=>{
	forbiddenOper(res, "PUT", "/favorites");
})
.delete(corsRouter.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{
	favoriteModel.findOne({"user": (req.user._id)})
	.populate("user")
	.populate("dishes")
	.then((data)=>{
		if(data){
			favoriteModel.deleteOne({"user": (req.user._id)})
			.then((resp)=>{
				console.log("\n\nThe favorites list has been deleted\n");
				res.statusCode = 200;
				res.json(resp);
			}, (err) => next(err))
			.catch((err)=>{
				console.error("Error in delete >>> ", err);
			});
		}
		else{
			err = new Error(`/favorites not found.`);
			err.status = 404;
			return next(err);
		}
	}, (err) => next(err))
		.catch((err)=>{
		console.error("Error getting the favorites list >>> ", err);
	});
		
})

// endpoint with id
favoritesRouter.route("/:dishId")
.get((req, res, next)=>{
	forbiddenOper(res, "GET", "/favorites/:dishId");
})
.post(corsRouter.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{
	favoriteModel.findOne({"user": (req.user._id)})
	.then((data)=>{
		if(data){
			if(data.dishes.indexOf(req.params.dishId) === (-1)){
				data.dishes.push(req.params.dishId);      
				data.save()
				res.statusCode = 200;
				res.setHeader("Content-type", "application/json");
				res.end(`dish ${req.params.dishId} added to favorites.`);
			}
			else{
				res.end("Dish already added in the favorite list")
			}
		}
		else{
			err = new Error(`favorites list not found.`);
			err.status = 404;
			return next(err);
		}
	}, (err) => next(err))
		.catch((err)=>{
		console.error("Error getting the favorites list >>> ", err);
	});
})
.put((req, res, next)=>{
	forbiddenOper(res, "PUT", "/favorites/:dishId");
})
.delete(corsRouter.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{
	favoriteModel.findOne({"user": (req.user._id)})
	.then((data)=>{
		if(data){
			let index=data.dishes.indexOf(req.params.dishId);
			if(index === (-1)){
				res.end(`The dish with ID ${req.params.dishId} does not exist in the favorite list`);
			}
			else{
				console.log("data.dishes", data.dishes)
				data.dishes.splice(index, 1);
				data.dishes = data.dishes;
				data.save()
				res.statusCode = 200;
				res.setHeader("Content-type", "application/json");
				res.end(`dish ${req.params.dishId} removed from favorites.`);
			}
		}
		else{
			err = new Error(`favorites list not found.`);
			err.status = 404;
			return next(err);
		}
	}, (err) => next(err))
		.catch((err)=>{
		console.error("Error getting the favorites list >>> ", err);
	});});

module.exports = favoritesRouter;