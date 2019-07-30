const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var passporLocalMongoose = require("passport-local-mongoose");

const userShcema = new Schema({
    admin: {
        type: Boolean,
        default: false
    }
});

userShcema.plugin(passporLocalMongoose);
module.exports = mongoose.model("User", userShcema);