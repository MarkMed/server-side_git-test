const express = require("express");
// const fs = require("fs");
const hostname = "localhost";
const http = require("http");
// const path = require("path");
const port = 4898;

const app = express();
app.use((req, res, next)=>{
	console.log(req.headers);
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