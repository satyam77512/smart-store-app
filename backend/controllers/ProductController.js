const Product = require("../models/product.model");
const User = require("../models/user.model");

const fetchProduct = async(req,res)=>{
    try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const product = await Product.findOne({productId});

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({ error: "Server error" });
  }
}

const addProduct = async(req,res)=>{
   try {
    let { productId, name, price, productDetails} = req.body;
    // Validate required fields
    if (!productId || !name || !price) {
      return res.status(400).json({ error: "productId, name, and price are required" });
    }

    // Convert price to number
    price = Number(price);
    if (isNaN(price)) {
      return res.status(400).json({ error: "Price must be a number" });
    }

    // Check if product already exists
    const existingProduct = await Product.findOne({ productId });
    if (existingProduct) {
      return res.status(409).json({ error: "Product already exists" });
    }

    // Create new product
    const newProduct = new Product({
      productId,
      name,
      price,
      productDetails,
    });

    await newProduct.save();

    return res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    return res.status(500).json({ error: "Server error" });
  }
}

const buyProduct = async(req,res)=>{
    try {
    const {productId,username} = req.body;

    if (!productId){
      return res.status(400).json({ error: "Product ID is required" });
    }
    if(!username){
      return res.status(400).json({ error: "User ID is required" }); 
    }

    const product = await Product.findOne({productId :productId});
    const user = await User.findOne({username})

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    if(!user){
      return res.status(404).json({ error: "User not found" });
    }

    user.cart.push(product._id);
    await user.save();

    return res.status(200).json({ message: "Product bought and removed successfully", product });
  } catch (error) {
    console.error("Error buying product:", error);
    return res.status(500).json({ error: "Server error" });
  }
}

const fetchCart = async(req,res)=>{
  try {
    const { username } = req.body;
 
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const user = await User.findOne({ username }).populate("cart");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ cart: user.cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
const removeItem = async (req, res) => {
  try {
    const { username, productId } = req.body;
  
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }
    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const user = await User.findOne({ username }).populate("cart");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Remove the product from the user's cart
    user.cart = user.cart.filter(
      (item) => item.productId.toString() !== productId
    );
    await user.save();

    return res.status(200).json({ message: "Item removed from cart", cart: user.cart });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

const payment = async(req,res)=>{
  const {username} = req.body;
  const user = User.findOne({username});
}

module.exports = {fetchProduct,addProduct,buyProduct,fetchCart,removeItem};