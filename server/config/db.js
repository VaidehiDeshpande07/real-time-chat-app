const mongoose = require("mongoose");

const connectDB = async () => {
    const primaryUri = process.env.MONGO_URI;
    const localUri = "mongodb://127.0.0.1:27017/nextalk";

    if (!primaryUri) {
        console.error("[MongoDB Error] MONGO_URI is not defined in .env");
        process.exit(1);
    }

    try {
        const conn = await mongoose.connect(primaryUri, { serverSelectionTimeoutMS: 5000 });
        console.log(`[MongoDB] Connected successfully to database: "${conn.connection.name}" on host: ${conn.connection.host}`);
    } catch (error) {
        console.warn(`[MongoDB Warning] Primary connection failed: ${error.message}`);
        console.log("[MongoDB] Attempting fallback to local instance (mongodb://127.0.0.1:27017/nextalk)...");

        try {
            const localConn = await mongoose.connect(localUri, { serverSelectionTimeoutMS: 5000 });
            console.log(`[MongoDB] Connected successfully to fallback local database: "${localConn.connection.name}"`);
        } catch (localError) {
            console.error(`[MongoDB Error] Connection failed: ${localError.message}`);
            console.error("Please verify your MONGO_URI in server/.env or ensure MongoDB is running.");
            process.exit(1);
        }
    }
};

module.exports = connectDB;