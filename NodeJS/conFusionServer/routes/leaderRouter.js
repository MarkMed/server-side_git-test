// modules exports and const definitions
const express = require("express");
const bodyParser = require("body-parser");
const leadersRouter = express.Router();
leadersRouter.use(bodyParser.json());
const mongoose = require("mongoose");
const Leaders = require("../models/leaders");
const authenticate = require("../authenticate");
const corsRouter = require("./corsRoute");

// global endpoint
leadersRouter.route("/")
.options(corsRouter.corsWithOptions, (req, res)=>{ 	res.sendStatus(200); })
.get((req, res, next)=>{
	console.log("\n\nGetting the whole list of Leaders:\n")
	Leaders.find({})
		.then((data)=>{
			if(data){
				res.statusCode = 200;
				res.setHeader("Content-type", "application/json");
				res.json(data);
			}
			else{
				err = new Error(`/leaders not found.`);
				err.status = 404;
				return next(err);
			}
		}, (err) => next(err))
		.catch((err)=>{
			console.error("Error in get >>> ", err);
		});
})
.post(corsRouter.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
	Leaders.create(req.body)
	.then((data)=>{
		res.statusCode = 200;
		res.setHeader("Content-type", "application/json");
		res.json(data);
		console.log("\nNew leader added:\n", data);
	}, (err) => next(err))
	.catch((err)=>{
		Leaders.remove({});
		console.error("Error in post >>> ", err);
	});
})
.put(corsRouter.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{
	res.statusCode = 403;
	res.end("PUT opartion is forbidden on /leaders");
})
.delete(corsRouter.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{
	Leaders.remove({})
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
leadersRouter.route("/:leaderId")
.options(corsRouter.corsWithOptions, (req, res)=>{ 	res.sendStatus(200); })
.get((req, res, next)=>{
	const leaderId = req.params.leaderId;
	console.log("\n\nGetting the leader with id: "+leaderId);
	Leaders.findById(leaderId)
	.then((data)=>{
		if(data){
			res.statusCode = 200;
			res.setHeader("Content-type", "application/json");
			res.json(data);
		}
		else{
			err = new Error(`Leader #${leaderId} not found.`);
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
	const leaderId = req.params.leaderId;
	console.log("\n\nUpdating the leader with id: "+leaderId);
	Leaders.findById(leaderId)
	.then((data)=>{
		if(data){
			Leaders.findByIdAndUpdate(
				leaderId, 
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
			err = new Error(`Leader #${leaderId} not found.`);
			err.status = 404;
			return next(err);
		}
	}, (err) => next(err))
	.catch((err)=>{
		console.error("Error in put /id >>> ", err);
	});
})
.delete(corsRouter.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
	const leaderId = req.params.leaderId;
	console.log("\n\nDeleting the leader with id: "+leaderId);
	Leaders.findById(leaderId)
	.then((data)=>{
		if(data){
			Leaders.findByIdAndRemove(leaderId)
			.then((data)=>{
				res.statusCode = 200;
				res.setHeader("Content-type", "application/json");
				res.json(data);
			}, (err) => next(err));
		}
		else{
			err = new Error(`Leader #${leaderId} not found.`);
			err.status = 404;
			return next(err);
		}
	}, (err) => next(err))
	.catch((err)=>{
		console.error("Error in get /id >>> ", err);
	});
});

module.exports = leadersRouter;