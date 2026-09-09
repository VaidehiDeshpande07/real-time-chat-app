const Message = require("../models/Message");

// Get messages between two users
const getMessages = async (req, res) => {
    try {
        const { userId } = req.params;
        const { currentUserId } = req.query;

        if (!currentUserId) {
            return res.status(400).json({
                message: "currentUserId is required"
            });
        }

        const messages = await Message.find({
            $or: [
                { sender: currentUserId, receiver: userId },
                { sender: userId, receiver: currentUserId }
            ]
        })
            .sort({ createdAt: 1 })
            .populate("sender", "name email")
            .populate("receiver", "name email");

        res.json(messages);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch messages"
        });
    }
};

// Create a new message
const createMessage = async (req, res) => {
    try {
        const { sender, receiver, content } = req.body;

        if (!sender || !receiver || !content) {
            return res.status(400).json({
                message: "sender, receiver and content are required"
            });
        }

        const message = await Message.create({
            sender,
            receiver,
            content
        });

        const populatedMessage = await message.populate([
            {
                path: "sender",
                select: "name email"
            },
            {
                path: "receiver",
                select: "name email"
            }
        ]);

        res.status(201).json(populatedMessage);
    } catch (error) {
        res.status(500).json({
            message: "Failed to create message"
        });
    }
};

module.exports = {
    getMessages,
    createMessage
};