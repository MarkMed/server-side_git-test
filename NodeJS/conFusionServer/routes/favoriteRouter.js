// modules exports and const definitions
const express = require("express");
const bodyParser = require("body-parser");
const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());
const mongoose = require("mongoose");
const corsRouter = require("./corsRoute");
const favoriteModel = require("../models/favorites");
const authenticate = require("../authenticate");

function forbiddenOper(res, operation, endpoint){
    res.statusCode = 403;
    res.end(`${operation} operation is forbidden on ${endpoint}`);
}

favoriteRouter.route("/")
.get()
.post()
.put((req, res, next)=>{
    forbiddenOper(res, "PUT", "/favorites");
})
.delete()

favoriteRouter.route("/:dishId")
.get((req, res, next)=>{
    forbiddenOper(res, "GET", "/favorites/:dishId");
})
.post()
.put((req, res, next)=>{
    forbiddenOper(res, "PUT", "/favorites/:dishId");
})
.delete()