// modules exports and const definitions
const express = require("express");
const bodyParser = require("body-parser");
const dishesRouter = express.Router();
dishesRouter.use(bodyParser.json());

// global endpoint
dishesRouter.route("/")
.all((req, res, next)=>{
	res.statusCode=200;
	res.setHeader("Content-type", "text/plain");
	next();
})
.get((req, res, next)=>{
	res.end("Must to bring all dishes list to you!");
	
})
.post((req, res, next)=>{
	res.end(`Adding a new dishe to the list. Name: "${req.body.name}", Description: "${req.body.description}".`);	
})
.put((req, res, next)=>{
	res.statusCode = 403;
	res.end("PUT opartion is forbidden on /dishes");
})
.delete((req, res, next)=>{
	res.end("Deleting the whole dishes list.");	
});

// endpoint with id
dishesRouter.route("/:dishId")
.get((req, res, next)=>{
	res.end(`The get action has returned the dish with id: "${req.params.dishId}"`);
})
.post((req, res, next)=>{
	res.statusCode = 403;
	res.end("POST opartion is forbidden on an already existing resource.");
})
.put((req, res, next)=>{
	res.write("<i> params to include in the body of request: 'name', 'price' </i>");
	res.write("\n");
	res.end(`Updating the dish with id: "${req.params.dishId}". New Name: "${req.body.name}". New description: "${req.body.price}".`);	
})
.delete((req, res, next)=>{
	res.end(`Deleting the dish with id: "${req.params.dishId}".`);	
});

module.exports = dishesRouter;