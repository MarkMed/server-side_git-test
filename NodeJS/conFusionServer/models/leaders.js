const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const leaderSchema = new Schema({
    abbr: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    image: {
        type: String,
        default: "http://chemsys.in/wp-content/uploads/2018/03/icon.png",
        required: false
    },
    name: {
        type: String,
        required: true,
        unique: true
    }
},
{
    timestamps: true
}
);

let leadersModel = mongoose.model("Leader", leaderSchema);

module.exports = leadersModel;