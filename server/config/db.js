const mongoose = require("mongoose");

const connectDB = async () => {
    const primaryUri = process.env.MONGO_URI;
    const localUri = "mongodb://127.0.0.1:27017/nextalk";

    try {
        await mongoose.connect(primaryUri, { serverSelectionTimeoutMS: 5000 });
        console.log("MongoDB connected successfully (Primary URI)");
    } catch (error) {
        console.warn("Primary MongoDB connection failed:", error.message);
        console.log("Attempting fallback to local MongoDB instance (mongodb://127.0.0.1:27017/nextalk)...");

        try {
            await mongoose.connect(localUri, { serverSelectionTimeoutMS: 5000 });
            console.log("Connected successfully to fallback local MongoDB (mongodb://127.0.0.1:27017/nextalk)");
        } catch (localError) {
            console.error("Local MongoDB connection also failed:", localError.message);
            console.error("Check your MONGO_URI in .env or ensure MongoDB is running.");
            process.exit(1);
        }
    }
};

module.exports = connectDB;