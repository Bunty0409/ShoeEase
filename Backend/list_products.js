const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const Product = require("./models/productModel");

const check = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const count = await Product.countDocuments({});
    console.log("Total products in database:", count);
    if (count > 0) {
      const products = await Product.find({}, "title tags price brand images").limit(20);
      console.log("Products in database:");
      console.log(JSON.stringify(products, null, 2));
    } else {
      console.log("NO PRODUCTS IN DATABASE!");
    }
  } catch (err) {
    console.error("Error:", err);
  }
  process.exit(0);
};
check();
