const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userShcema = new Schema({
    admin: {
        type: Boolean,
        default: false
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("User", userShcema);