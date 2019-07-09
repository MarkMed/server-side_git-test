// modules exports and const definitions
const bodyParser = require("body-parser")
const dishesRouter = require("./router/dishRouter");
const express = require("express");
const hostname = "localhost";
const http = require("http");
const leadersRouter = require("./router/leaderRouter");
const morgan = require("morgan");
const port = 4898;
const promotionsRouter = require("./router/promoRouter");

const app = express();

// including mdules in app
app.use(morgan("dev"));
app.use(bodyParser.json());

// Assinging endpoints
app.use("/dishes", dishesRouter);
app.use("/leaders", leadersRouter);
app.use("/promotions", promotionsRouter);
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

// deploy server
const server = http.createServer(app);
server.listen(port, hostname, ()=>{console.log(`Server running at http://${hostname}:${port}`)});