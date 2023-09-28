const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: String,
    type: String,
    price: Number,
    Tax:Number,

});

module.exports = mongoose.model("Product", ProductSchema);
