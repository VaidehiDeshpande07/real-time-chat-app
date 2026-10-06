const express = require("express");
const {
    getUsers,
    createUser,
    getAdminData
} = require("../controllers/userController");

const { protect, requireRole } = require("../middleware/authMiddleware");
const { validateUser } = require("../middleware/validationMiddleware");

const router = express.Router();

router.post("/", validateUser, createUser);
router.get("/", protect, getUsers);
router.get("/admin", protect, requireRole("ADMIN"), getAdminData);

module.exports = router;