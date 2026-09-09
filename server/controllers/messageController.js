const Message = require("../models/Message");

// Get messages between two users
const getMessages = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user;

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
        console.error("Get messages error:", error.message);

        res.status(500).json({
            message: "Failed to fetch messages"
        });
    }
};
// Create a new message
const createMessage = async (req, res) => {
    try {
        const { receiver, content } = req.body;

        if (!receiver || !content) {
            return res.status(400).json({
                message: "receiver and content are required"
            });
        }

        const message = await Message.create({
            sender: req.user,
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
    }  catch (error) {
    console.error("Create message error:", error.message);

    res.status(500).json({
        message: "Failed to create message",
        error: error.message
    });
}
};
module.exports = {
    getMessages,
    createMessage
};