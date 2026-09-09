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

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "name, email and password are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "User with this email already exists"
            });
        }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
    name,
    email,
    password: hashedPassword,
    status
});

        const safeUser = user.toObject();
        delete safeUser.password;

        res.status(201).json(safeUser);
    } catch (error) {
        res.status(500).json({
            message: "Failed to create user"
        });
    }
};

module.exports = {
    getUsers,
    createUser
};