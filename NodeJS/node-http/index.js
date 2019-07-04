const fs = require("fs");
const http = require("http");
const hostname = "localhost";
const path = require("path");
const port = "4444";
const server = http.createServer((req, res) => {
	console.log(`Request made from: ${req.url} , by the method: ${req.method}`);
	if(req.method === "GET"){
		let fileUrl, filePath, fileExtension;
		if(req.url === "/") fileUrl = "/index.html";
		else fileUrl = req.url;
		filePath=path.resolve(`./public${fileUrl}`);
		console.log(fileUrl);
		fileExtension=path.extname(filePath);
		if(fileExtension === ".html"){
			fs.exists(filePath, (exist)=>{
				if(!exist){
					res.statusCode = 404;
					res.setHeader("Content-type", "text/html");
					res.end(`
						<!DOCTYPE html>
						<html lang="en">
							<head>
								<meta charset="UTF-8">
								<meta name="viewport" content="width=device-width, initial-scale=1.0">
								<meta http-equiv="X-UA-Compatible" content="ie=edge">
								<title>Document</title>
							</head>
							<body>
								<header>
									<h1>Error 404</h1>
									<p>That file does not exist!</p>
									<p>File: ${fileUrl} not found</p>
								</header>
								<main>
									<h3><i>Commentary</i></h3>
									<p>LoL! I programmed my first 404 fucking file NOT EXIST MDF</p>
									<p>I'am so exited :´3</p>
								</main>
							</body>
						</html>
					`);
					return;
				}
				res.statusCode=200;
				res.setHeader("Content-type", "text/html");
				fs.createReadStream(filePath).pipe(res);
			})
		}
		else{
			res.statusCode = 404;
			res.setHeader("Content-type", "text/html");
			res.end(`
				<!DOCTYPE html>
				<html lang="en">
					<head>
						<meta charset="UTF-8">
						<meta name="viewport" content="width=device-width, initial-scale=1.0">
						<meta http-equiv="X-UA-Compatible" content="ie=edge">
						<title>Document</title>
					</head>
					<body>
						<header>
							<h1>Error 404</h1>
							<p>That file does not exist!</p>
							<p>File: ${fileUrl} is not an HTML file</p>
						</header>
						<main>
							<h3><i>Commentary</i></h3>
							<p>LoL! I programmed my first 404 fucking file NOT EXIST MDF</p>
							<p>I'am so exited :´3</p>
						</main>
					</body>
				</html>
			`);
			return;
		}
	}
	else{
		res.statusCode = 404;
		res.setHeader("Content-type", "text/html");
		res.end(`
			<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<meta http-equiv="X-UA-Compatible" content="ie=edge">
					<title>Document</title>
				</head>
				<body>
					<header>
						<h1>Request no supported</h1>
						<p>This server does not support the ${req.method} method... yet</p>
					</header>
					<main>
						<h3><i>Commentary</i></h3>
						<p>LoL! I programmed my first 404 fucking file NOT EXIST MDF</p>
						<p>I'am so exited :´3</p>
					</main>
				</body>
			</html>
		`);
		return;

	}
});

server.listen(port, hostname, ()=>{console.log(`Server running at http://${hostname}:${port}`)});