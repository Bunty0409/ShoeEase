const mongoose = require("mongoose");

// BUG-05 FIX: mongoose.connect() is async — must be awaited so connection
// failures are caught and logged instead of being silently swallowed.
const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};

module.exports = dbConnect;
