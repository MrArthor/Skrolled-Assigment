const express = require("express");
const router = express.Router();
const Cart = require("../Model/Cart");
const Product = require("../Model/Product");
const User = require("../Model/user");
const { isLoggedIn } = require("../middleware");
const Order = require("../Model/Order");
const WishList = require("../Model/wishlist");



router.get("/", (req, res) => { //Home page
    res.render("home");
});

router.get("/login", (req, res) => { //Login for logging in the user
    res.render("login");
});

router.post("/login", async(req, res) => { //Login for logging in the user
    const { username, password } = req.body;
    const user = await User.findOne({ username: username, password: password });
    if (user) {
        req.session.user = user;

        req.session.user_id = user._id;
        req.flash("success", "Welcome back!");
        res.redirect("/product");
    } else {
        req.flash("error", "Incorrect username or password");
        res.redirect("/login");
    }
});

router.get("/register", (req, res) => { //Register for registering the user
    res.render("signup");
});

router.post("/register", async(req, res) => { //Register for registering the user
    try {
        const { username, password } = req.body;
        const user = new User({ username, password });
        await user.save();
        req.session.user = user;
        req.session.user_id = user._id;
        req.flash("success", "Successfully signed up!");
        res.redirect("/product");
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }
});

router.get("/logout", isLoggedIn, (req, res) => { //Logout for logging out the user
    req.session.user = null;
    req.flash("success", "Goodbye!");
    res.redirect("/");
});

router.get("/cart", isLoggedIn, async(req, res) => { //Cart for adding the product to cart
    const useris = req.session.user_id;
    const user = await User.findById(useris).populate({
        path: "cart",
        populate: {
            path: "ProductId",
        },
    });
    req.flash("success", "Entered Cart!");
    if (user.cart) {
        const Product = user.cart.ProductId;
        for (prod of Product) {
            if (prod.type == "Product") {
                if (prod.price > 1000 && prod.price < 5000) {
                    prod.Tax = prod.price * 0.12;
                } else if (prod.price > 5000) {
                    prod.Tax = prod.price * 0.18;
                }
                prod.tax += 200;
            } else if (prod.type == "service") {
                if (prod.price > 1000 && prod.price < 8000) {
                    prod.Tax = prod.price * 0.1;
                } else if (prod.price > 8000) {
                    prod.Tax = prod.price * 0.15;
                }
                prod.tax += 100;
            }
            await prod.save();
        }
        await user.save();
        const Total = null;
        res.render("cart", { Product, Total });
    } else {
        const Product = [],
            Total = null;
        res.render("cart", { Product, Total });
    }
});

router.get("/DeleteCart", isLoggedIn, async(req, res) => { //DeleteCart for deleting the cart
    const useris = req.session.user_id;
    const user = await User.findById(useris).populate({
        path: "cart",
        populate: {
            path: "ProductId",
        },
    });

    const cart = await Cart.findByIdAndDelete(user.cart._id);
    user.cart = null;
    await user.save();
    res.redirect("/product");
});

router.get("/TotalBill", isLoggedIn, async(req, res) => { //TotalBill for calculating the total bill
    const useris = req.session.user_id;
    const user = await User.findById(useris).populate({
        path: "cart",
        populate: {
            path: "ProductId",
        },
    });
    const Product = user.cart.ProductId;
    let Total = 0;
    for (prod of Product) {
        Total += prod.price + prod.Tax;
    }
    const order = new Order({
        ProductId: Product,
    });
    await order.save();
    const cart = await Cart.findByIdAndDelete(user.cart._id);
    user.cart = null;
    await user.save();

    res.render("cart", { Product, Total });
});

router.get("/product/", isLoggedIn, async(req, res) => { //Product page
    const useris = req.session.user_id;

    const user = await User.findById(useris).populate({
        path: "cart",
        populate: {
            path: "ProductId",
        },
    });
    if (user.cart) {
        const SelectedProduct = user.cart.ProductId;
        const Products = await Product.find({});
        res.render("product", { Products, SelectedProduct });
    } else {
        const SelectedProduct = [];
        const Products = await Product.find({});
        res.render("product", { Products, SelectedProduct });
    }
});
router.get('/Product/:id', isLoggedIn, async(req, res) => { //Product page
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render("ProductShow", { product });

});
router.get("/wishlist", isLoggedIn, async(req, res) => { //Product page
    const useris = req.session.user_id;
    const user = await User.findById(useris).populate({
        path: "wishlist",
        populate: {
            path: "ProductId",
        },
    });
    const List = user.wishlist;
    res.send(List);
    // res.render("wishlist", { List });
});




router.get("/AddToWishList/:id", isLoggedIn, async(req, res) => { //Product page


    const useris = req.session.user_id;
    const user = await User.findById(useris).populate({
        path: "wishlist",
        populate: {
            path: "ProductId",
        },
    });
    const List = user.wishlist;
    List.ProductId.push(req.params.id);
    await List.save();
    res.redirect("/wishlist");

});
router.put("/AddToCart", isLoggedIn, async(req, res) => {
    //AddToCart for adding the product to cart
    const CartList = req.body.CartList;
    const cart = new Cart({
        ProductId: CartList,
    });

    await cart.save();
    const car = await Cart.find({ _id: cart._id }).populate("ProductId");

    const user = await User.findById(req.session.user_id).populate("cart");

    user.cart = cart._id;
    await user.save();

    res.redirect("/cart");
});

module.exports = router;