const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Product = require("./Product");
const wishlist = require("./wishlist");
const Cart = require("./Cart");
const UserSchema = new Schema({
        username: String,
        password: String,
        cart: {
            type: Schema.Types.ObjectId,
            ref: "Cart",
        },
        wishlist: {
            type: Schema.Types.ObjectId,
            ref: "wishlist",
        },
    }

);

module.exports = mongoose.model("User", UserSchema);