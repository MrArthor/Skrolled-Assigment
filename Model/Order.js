const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Product = require("./Product");
const OrderSchema = new Schema({
    ProductId: [{
        type: Schema.Types.ObjectId,
        ref: "Product",
    } ],
});

module.exports = mongoose.model("Order", OrderSchema);