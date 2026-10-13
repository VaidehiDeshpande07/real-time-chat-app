require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user");

async function makeAdmin() {
  if (!process.env.MONGO_URI) {
    console.error("Error: MONGO_URI environment variable is required.");
    process.exit(1);
  }

  if (!process.env.ADMIN_PASSWORD) {
    console.error("Error: ADMIN_PASSWORD environment variable is required.");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const email = process.env.ADMIN_EMAIL || "admin@example.com";
    const password = process.env.ADMIN_PASSWORD;

    let user = await User.findOne({ email });

    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.create({
        name: "Admin User",
        email,
        password: hashedPassword,
        role: "ADMIN",
      });

      console.log("Admin user created with secure password hash");
    } else {
      user.role = "ADMIN";
      await user.save();

      console.log("Existing user promoted to ADMIN without changing password");
    }

    console.log({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Error:", error.message);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
}

makeAdmin();