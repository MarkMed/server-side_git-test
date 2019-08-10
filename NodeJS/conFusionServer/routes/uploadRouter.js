// modules exports and const definitions
const express = require("express");
const bodyParser = require("body-parser");
const uploadRouter = express.Router();
uploadRouter.use(bodyParser.json());
const authenticate = require("../authenticate");
const multer = require("multer");
const corsRouter = require("./corsRoute");

const memory = multer.diskStorage(
    {
        destination:  (req, file, callback)=>{
            //callback function were firs prameter es the error and second is the destination folder
            callback(null, "public/images");

        },
        filename: (req, file, callback)=>{
            //callback function were firs prameter es the error and second is the filename
            callback(null, file.originalname);
        }
    }
);

const imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|svg)$/)){
        return callback(new Error("The file that you try to upload is not allowed."))
    }
    callback(null, true);
}

const upload = multer({
    storage: memory,
    fileFilter: imageFileFilter
});

function notAllowedOper(res, operation){
        res.statusCode = 403;
        res.end(`${operation} opartion is forbidden on /imageUpload`);
}
// global endpoint
uploadRouter.route("/")
.options(corsRouter.corsWithOptions, (req, res)=>{ 	res.sendStatus(200); })
.get(corsRouter.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
    notAllowedOper(res, "GET");
})
.put(corsRouter.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
    notAllowedOper(res, "PUT");
})
.post(corsRouter.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, upload.single("imageFile"), (req, res)=>{
    res.statusCode=200;
    res.setHeader("Content-Type", "application/json");
    res.json(req.file);
})
.delete(corsRouter.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
    notAllowedOper(res, "DELETE");
});

module.exports = uploadRouter;