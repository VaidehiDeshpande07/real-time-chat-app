const express = require("express");
const {
    getMessages,
    createMessage
} = require("../controllers/messageController");

const router = express.Router();

// GET messages between two users
router.get("/:userId", getMessages);

// POST create message
router.post("/", createMessage);

module.exports = router;