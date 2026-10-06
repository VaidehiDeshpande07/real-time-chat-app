require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user");

async function makeAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const email = "admin@example.com";
    const password = "AdminPass123";

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: "Admin User",
        email,
        password,
        role: "ADMIN",
      });

      console.log("Admin user created");
    } else {
      user.role = "ADMIN";
      await user.save();

      console.log("Existing user promoted to ADMIN");
    }

    console.log({
      name: user.name,
      email: user.email,
      role: user.role,
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

makeAdmin();