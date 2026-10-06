const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Get all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.json(users);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch users"
        });
    }
};

// Create a new user
const createUser = async (req, res) => {
    try {
        const { name, email, password, status } = req.body;
        console.log(`[User Backend] Registration request received for: ${name} (${email})`);

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "name, email and password are required"
            });
        }

        console.log(`[User Backend] Checking if user ${email} already exists in MongoDB...`);
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            console.log(`[User Backend] Registration rejected: ${email} already exists`);
            return res.status(409).json({
                message: "User with this email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Normal users cannot assign themselves ADMIN during registration
        console.log(`[User Backend] Creating new user in MongoDB: ${name}`);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            status: status || "offline",
            role: "USER"
        });

        console.log(`[User Backend] User successfully created in MongoDB with ID: ${user._id}`);
        const safeUser = user.toObject();
        delete safeUser.password;

        res.status(201).json(safeUser);
    } catch (error) {
        console.error("[User Backend] Create user error:", error.message);
        res.status(500).json({
            message: "Failed to create user"
        });
    }
};

// Admin-only dashboard/data endpoint (Experiment 6)
const getAdminData = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const onlineUsers = await User.countDocuments({ status: "online" });
        const adminUsers = await User.countDocuments({ role: "ADMIN" });

        res.json({
            message: "Admin dashboard access granted",
            adminUser: req.user,
            stats: {
                totalUsers,
                onlineUsers,
                adminUsers
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch admin data"
        });
    }
};

module.exports = {
    getUsers,
    createUser,
    getAdminData
};