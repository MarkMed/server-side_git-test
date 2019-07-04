const http = require("http");
const hostname = "localhost";
const port = "4444";
const server = http.createServer(reqRes);
function reqRes(req, res){
    console.log(req.headers);
    res.statusCode= 200;
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
            <header>This is server test</header>
            <main>
                <h3><i>Commentary</i></h3>
                <p>I hope that this what I will see in the page.</p>
                <p>This is what the server returns as main?</p>
            </main>
        </body>
    </html>
    `);
}
server.listen(port, hostname, ()=>{console.log(`Server running at http://${hostname}:${port}`)});