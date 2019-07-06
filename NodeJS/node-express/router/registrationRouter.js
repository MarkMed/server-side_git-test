const express = require("express");
const bodyParser = require("body-parser");
const registrationRouter = express.Router();
registrationRouter.use(bodyParser.json());

registrationRouter.route("/")

.all((req, res, next)=>{
	res.statusCode=200;
	res.setHeader("Content-type", "text/plain");
	next();
})
.get((req, res, next)=>{
	res.end("Must to bring all payment registrarion to you!");
	
})
.post((req, res, next)=>{
	res.end(`Adding a new registration log. Name: "${req.body.name}", Description: "${req.body.description}".`);	
})
.put((req, res, next)=>{
	res.statusCode = 403;
	res.end("PUT opartion is forbidden on /payments");
})
.delete((req, res, next)=>{
	res.end("Deleting the whole registrations intances.");	
});

module.exports = registrationRouter;