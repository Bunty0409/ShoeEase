const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const Order = require("./models/orderModel");

const check = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const count = await Order.countDocuments({});
    console.log("Total orders in database:", count);
    if (count > 0) {
      const orders = await Order.find({}).limit(5);
      console.log("Sample orders:", JSON.stringify(orders, null, 2));
      
      let endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() - 1);
      
      console.log("Matching dates between:", endDate, "and", new Date());

      const data = await Order.aggregate([
        {
          $match: {
            createdAt: {
              $lte: new Date(),
              $gte: endDate,
            },
          },
        },
        {
          $group: {
            _id: {
              month: "$month",
            },
            amount: { $sum: "$totalPriceAfterDiscount" },
            count: { $sum: 1 },
          },
        },
      ]);
      console.log("Aggregation monthly data:", JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error("Error running check:", err);
  }
  process.exit(0);
};
check();
