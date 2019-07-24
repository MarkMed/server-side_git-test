const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("mongoose-currency").loadType(mongoose);
const Currency = mongoose.Types.Currency;

const promotionSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    image: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ""
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    }
},
{
    timestamps: true
}
);

let promotionsModel = mongoose.model("Promotion", promotionSchema);

module.exports = promotionsModel;