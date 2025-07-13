const Product = require("../models/product.model");
const User = require("../models/user.model");
const Bill = require("../models/bill.model");

const payment = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username }).populate("cart");
    if (!user) return res.status(404).json({ message: "User not found" });

    const cart = user.cart;
    const newBill = new Bill({
      username: user.username,
      name: user.name,
      items: [],
      totals: 0,
    });

    let total = 0;
    for (const product of cart) { // foreach cannot await
      // await Product.findOneAndDelete({ _id: product._id });
      newBill.items.push({ product: product._id, price: product.price });
      total += product.price;
    }
    newBill.totals = total;

    await newBill.save();

    user.cart = [];
    user.bills.push(newBill._id);
    await user.save();

    res.status(201).json({ message: "Payment successful", bill: newBill });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { payment };