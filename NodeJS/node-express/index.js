const bodyParser = require("body-parser")
const express = require("express");
// const fs = require("fs");
const morgan = require("morgan");
const hostname = "localhost";
const http = require("http");
// const path = require("path");
const port = 4898;

const app = express();
app.use(morgan("dev"));
app.use(bodyParser.json());

app.all("/payments", (req, res, next)=>{
	res.statusCode=200;
	res.setHeader("Content-type", "text/plain");
	next();
});

app.get("/payments", (req, res, next)=>{
	res.end("Must to bring all payment registrarion to you!");
	
});
app.post("/payments", (req, res, next)=>{
	res.end(`Adding a new registration log. Name: "${req.body.name}", Description: "${req.body.description}".`);	
});
app.put("/payments", (req, res, next)=>{
	res.statusCode = 403;
	res.end("PUT opartion is forbidden on /payments");
});
app.delete("/payments", (req, res, next)=>{
	res.end("Deleting the whole registrations intances.");	
});

app.get("/payments/:registrationName", (req, res, next)=>{
	res.end(`Must to bring the payment registrarion "${req.params.registrationName}" to you!`);
	
});
app.post("/payments/:registrationName", (req, res, next)=>{
	res.statusCode = 403;
	res.end("POST opartion is forbidden on an already existing resource.");
});
app.put("/payments/:registrationName", (req, res, next)=>{
	res.end(`Updating the registration log. Name: "${req.params.registrationName}" => "${req.body.name}". New description: "${req.body.description}".`);	
});
app.delete("/payments/:registrationName", (req, res, next)=>{
	res.end(`Deleting the registration "${req.params.registrationName}".`);	
});

app.use(express.static(__dirname+"/public"));
app.use((req, res, next)=>{
	res.statusCode=200;
	res.setHeader("Content-type", "text/html");
	res.end(`
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<meta http-equiv="X-UA-Compatible" content="ie=edge">
				<title>Xpress Page</title>
			</head>
			<body>
				<header>
					<h1>Page made with Xpress</h1>
					<p>This is just a try</p>
				</header>
				<main>
					<h3><i>Commentary</i></h3>
					<p>This is my first time using express framework.... well... is my first time doing server-side</p>
					<p>I'am so exited :´3333</p>
				</main>
			</body>
		</html>
	`);
});

const server = http.createServer(app);
server.listen(port, hostname, ()=>{console.log(`Server running at http://${hostname}:${port}`)});