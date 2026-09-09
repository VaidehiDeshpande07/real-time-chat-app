const express = require("express");
const {
    getUsers,
    createUser
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const { validateUser } = require("../middleware/validationMiddleware");

const router = express.Router();

router.post("/", validateUser, createUser);
router.get("/", protect, getUsers);

module.exports = router;