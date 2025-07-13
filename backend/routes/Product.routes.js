const express = require('express');
const {addProduct,fetchProduct,buyProduct,fetchCart,removeItem} = require("../controllers/ProductController");

const router = express.Router();

router.post("/addProduct",addProduct);
router.post("/fetchProduct",fetchProduct);
router.post("/buyProduct",buyProduct);
router.post("/fetchCart",fetchCart);
router.post("/removeItem",removeItem);

module.exports = router;