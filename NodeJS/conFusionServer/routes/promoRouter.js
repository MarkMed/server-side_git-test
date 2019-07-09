// modules exports and const definitions
const express = require("express");
const bodyParser = require("body-parser");
const promotionsRouter = express.Router();
promotionsRouter.use(bodyParser.json());

// global endpoint
promotionsRouter.route("/")
.all((req, res, next)=>{
	res.statusCode=200;
	res.setHeader("Content-type", "text/plain");
	next();
})
.get((req, res, next)=>{
	res.end("Must to bring all aviable promotions to you!");
	
})
.post((req, res, next)=>{
	res.end(`Adding a new promotions to the list. Name: "${req.body.name}", Description: "${req.body.description}".`);	
})
.put((req, res, next)=>{
	res.statusCode = 403;
	res.end("PUT opartion is forbidden on /promotions");
})
.delete((req, res, next)=>{
	res.end("Deleting the whole promotions list.");	
});

// endpoint with id
promotionsRouter.route("/:promoId")
.get((req, res, next)=>{
	res.end(`The get action has returned the promotion with id: "${req.params.promoId}"`);
})
.post((req, res, next)=>{
	res.statusCode = 403;
	res.end("POST opartion is forbidden on an already existing resource.");
})
.put((req, res, next)=>{
	res.write("<i> params to include in the body of request: 'discount', 'dish' </i>");
	res.write("\n");
	res.end(`Updating the promotion with id: "${req.params.promoId}". Discount Amount: "${req.body.discount}". Dish: "${req.body.dish}".`);	
})
.delete((req, res, next)=>{
	res.end(`Deleting the promotion with id: "${req.params.promoId}".`);	
});

module.exports = promotionsRouter;