const express = require('express')
const router = express.Router()
const Product = require("../Model/Product");
const Order = require("../Model/Order");

router.get('/AddProdduct', (req, res) => {
    res.render('AddProdduct')
})

router.post('/AddProdduct', async(req, res) => {
    const RequestProduct= req.body.Prod;
    const NewProduct = new Product({
        name: RequestProduct.ProductName,
        price: RequestProduct.ProductPrice,
        type: RequestProduct.ProductType,
    })
    await NewProduct.save()
    res.redirect('admin/AddProdduct');
})


router.get("/OrderList", async (req, res) => {
    //OrderList for admin to see all the orders
    const Orders = await Order.find({}).populate({
      path: "ProductId",
    });
  
    res.render("OrderList", { Orders });
  });
  






module.exports = router;