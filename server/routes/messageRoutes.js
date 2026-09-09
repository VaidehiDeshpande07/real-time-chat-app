const express = require("express");
const {
    getMessages,
    createMessage
} = require("../controllers/messageController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:userId", protect, getMessages);
router.post("/", protect, createMessage);

module.exports = router;