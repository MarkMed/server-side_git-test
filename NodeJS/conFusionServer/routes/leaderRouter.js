// modules exports and const definitions
const express = require("express");
const bodyParser = require("body-parser");
const leadersRouter = express.Router();
leadersRouter.use(bodyParser.json());

// global endpoint
leadersRouter.route("/")
.all((req, res, next)=>{
	res.statusCode=200;
	res.setHeader("Content-type", "text/plain");
	next();
})
.get((req, res, next)=>{
	res.end("It should show to you a list of leaders!");
	
})
.post((req, res, next)=>{
	res.end(`Adding a new leaders To the list. Name: "${req.body.name}", Description: "${req.body.description}".`);	
})
.put((req, res, next)=>{
	res.statusCode = 403;
	res.end("PUT opartion is forbidden on /leaders");
})
.delete((req, res, next)=>{
	res.end("Deleting the whole leaders list.");	
});

// endpoint with id
leadersRouter.route("/:leaderId")
.get((req, res, next)=>{
	res.end(`The get action has returned the leader with id: "${req.params.leaderId}"`);
})
.post((req, res, next)=>{
	res.statusCode = 403;
	res.end("POST opartion is forbidden on an already existing resource.");
})
.put((req, res, next)=>{
	res.write("<i> params to include in the body of request: 'name', 'lastName' </i>");
	res.write("\n");
	res.end(`Updating the leader with id: "${req.params.leaderId}". New Name: "${req.body.name}". New Last Name: "${req.body.lastName}".`);	
})
.delete((req, res, next)=>{
	res.end(`Deleting the leader with id: "${req.params.leaderId}".`);	
});

module.exports = leadersRouter;