const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Product = require("./Product");
const WishSchema = new Schema({
    ProductId: [{
        type: Schema.Types.ObjectId,
        ref: "Product",
    }],
});

module.exports = mongoose.model("wishlist", WishSchema);