const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Product = require("./Product");
const CartSchema = new Schema({
    ProductId: [{
        type: Schema.Types.ObjectId,
        ref: "Product",
    } ],
});

module.exports = mongoose.model("Cart", CartSchema);