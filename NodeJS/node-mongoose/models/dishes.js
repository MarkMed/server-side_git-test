const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    rating: {
        type: Number,
        min: 0,
        max: 10,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
},
{
    timestaps: true
}
);

const dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    comments: [commentSchema]
},
{
    timestamps: true
}
);

let dishesModel = mongoose.model("Dish", dishSchema);

module.exports = dishesModel;