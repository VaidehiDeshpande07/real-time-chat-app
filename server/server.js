const http = require("http");
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const authRoutes = require("./routes/authRoutes");
const { initSocket } = require("./socket");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with HTTP server
const io = initSocket(server);
app.set("io", io);

// Middleware
app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

//API routes 
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "NexTalk API is running"
    });
});

const PORT = process.env.PORT || 5000;

// Start server after database connection
const startServer = async () => {
    await connectDB();

    server.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`Socket.IO initialized on ws://localhost:${PORT}`);
    });
};

process.on("unhandledRejection", (reason) => {
    console.error("[Process Warning] Unhandled Rejection:", reason);
});

process.on("uncaughtException", (error) => {
    console.error("[Process Error] Uncaught Exception:", error);
});

startServer();