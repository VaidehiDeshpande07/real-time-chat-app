const express = require("express");
const { loginUser } = require("../controllers/authController");
const { createUser } = require("../controllers/userController");
const { validateUser } = require("../middleware/validationMiddleware");

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", ...validateUser, createUser);

module.exports = router;