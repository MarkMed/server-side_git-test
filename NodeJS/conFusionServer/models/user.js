const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var passporLocalMongoose = require("passport-local-mongoose");

const userShcema = new Schema({
    firstname: {
        type: String,
        default: ""
    },
    lastname: {
        type: String,
        default: ""
    },
    facebookId: String,
    admin: {
        type: Boolean,
        default: false
    }
});

userShcema.plugin(passporLocalMongoose);
module.exports = mongoose.model("User", userShcema);