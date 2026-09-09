const express = require("express");
const {
    getUsers,
    createUser
} = require("../controllers/userController");

const router = express.Router();

// GET all users
router.get("/", getUsers);

// POST create user
router.post("/", createUser);

module.exports = router;