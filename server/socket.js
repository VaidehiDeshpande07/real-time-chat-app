const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("./models/user");
const Message = require("./models/message");

// In-memory mapping of online users: userId -> Set of active socket IDs
// Supports multiple tabs / devices per user
const onlineUsers = new Map();

function initSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
            credentials: true,
            methods: ["GET", "POST"]
        }
    });

    // -------------------------------------------------------------
    // Socket Authentication Middleware using JWT
    // -------------------------------------------------------------
    io.use(async (socket, next) => {
        try {
            // Read token from handshake auth or headers
            const token =
                socket.handshake.auth?.token ||
                (socket.handshake.headers?.authorization &&
                    socket.handshake.headers.authorization.startsWith("Bearer ")
                    ? socket.handshake.headers.authorization.split(" ")[1]
                    : null);

            if (!token) {
                console.log("[Socket Auth] Connection rejected: No token provided");
                return next(new Error("Authentication error: Token required"));
            }

            // Verify JWT
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.userId || decoded.id;

            if (!userId) {
                console.log("[Socket Auth] Connection rejected: Invalid token payload");
                return next(new Error("Authentication error: Invalid token payload"));
            }

            // Verify user exists in MongoDB
            const user = await User.findById(userId).select("_id name email role status");
            if (!user) {
                console.log(`[Socket Auth] Connection rejected: User ${userId} not found in database`);
                return next(new Error("Authentication error: User not found"));
            }

            // Attach authenticated user information to socket
            socket.user = {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role || "USER"
            };

            console.log(`[Socket Auth] User authenticated successfully: ${socket.user.name} (${socket.user.id})`);
            next();
        } catch (error) {
            console.log(`[Socket Auth] Connection rejected: ${error.message}`);
            return next(new Error(`Authentication error: ${error.message}`));
        }
    });

    // -------------------------------------------------------------
    // Connection Handler
    // -------------------------------------------------------------
    io.on("connection", (socket) => {
        const userId = socket.user.id;
        console.log(`[Socket.IO] Client connected: socket ${socket.id} for user ${socket.user.name} (${userId})`);

        // Join private user room based strictly on verified JWT identity
        socket.join(userId);

        // Track user presence in memory
        if (!onlineUsers.has(userId)) {
            onlineUsers.set(userId, new Set());
        }
        onlineUsers.get(userId).add(socket.id);

        // If this is the user's first connection, broadcast user:online
        if (onlineUsers.get(userId).size === 1) {
            socket.broadcast.emit("user:online", { userId });
            console.log(`[Presence] User ${socket.user.name} is now online`);
        }

        // Send current online users list to the newly connected client
        socket.emit("users:online_list", Array.from(onlineUsers.keys()));

        // ---------------------------------------------------------
        // Handle Real-Time Message Sending: message:send
        // ---------------------------------------------------------
        socket.on("message:send", async (data, callback) => {
            try {
                const { receiver, content } = data || {};

                // 1. Validate content
                if (!content || typeof content !== "string" || !content.trim()) {
                    const errPayload = { status: "error", message: "Message content cannot be empty" };
                    if (typeof callback === "function") callback(errPayload);
                    socket.emit("chat:error", errPayload);
                    return;
                }

                // 2. Validate receiver
                if (!receiver || !mongoose.Types.ObjectId.isValid(receiver)) {
                    const errPayload = { status: "error", message: "Invalid recipient ID" };
                    if (typeof callback === "function") callback(errPayload);
                    socket.emit("chat:error", errPayload);
                    return;
                }

                const receiverUser = await User.findById(receiver).select("_id name email");
                if (!receiverUser) {
                    const errPayload = { status: "error", message: "Recipient user not found" };
                    if (typeof callback === "function") callback(errPayload);
                    socket.emit("chat:error", errPayload);
                    return;
                }

                // 3. Persist message in MongoDB
                const message = await Message.create({
                    sender: userId,
                    receiver,
                    content: content.trim()
                });

                // Populate sender and receiver details
                const populatedMessage = await message.populate([
                    { path: "sender", select: "name email" },
                    { path: "receiver", select: "name email" }
                ]);

                console.log(`[Socket.IO] Message persisted and dispatched from ${socket.user.name} to ${receiverUser.name}`);

                // 4. Deliver message in real-time to recipient room
                io.to(receiver.toString()).emit("message:new", populatedMessage);

                // 5. Deliver to sender's other open tabs/devices (excluding current socket)
                socket.to(userId).emit("message:new", populatedMessage);

                // 6. Acknowledge back to sender socket
                if (typeof callback === "function") {
                    callback({ status: "ok", message: populatedMessage });
                } else {
                    socket.emit("message:sent", { status: "ok", message: populatedMessage });
                }
            } catch (error) {
                console.error("[Socket.IO] Error handling message:send:", error.message);
                const errPayload = { status: "error", message: "Failed to send message: " + error.message };
                if (typeof callback === "function") callback(errPayload);
                socket.emit("chat:error", errPayload);
            }
        });

        // ---------------------------------------------------------
        // Disconnect Handler
        // ---------------------------------------------------------
        socket.on("disconnect", (reason) => {
            console.log(`[Socket.IO] Client disconnected: socket ${socket.id} (${reason})`);
            const userSockets = onlineUsers.get(userId);
            if (userSockets) {
                userSockets.delete(socket.id);
                // If user has no more active socket connections, mark offline
                if (userSockets.size === 0) {
                    onlineUsers.delete(userId);
                    socket.broadcast.emit("user:offline", { userId });
                    console.log(`[Presence] User ${socket.user.name} is now offline`);
                }
            }
        });
    });

    return io;
}

module.exports = { initSocket, onlineUsers };
