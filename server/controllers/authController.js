const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`[Auth Backend] Login request received for email: ${email}`);

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        console.log("[Auth Backend] Searching user in MongoDB...");
        const user = await User.findOne({ email });

        if (!user) {
            console.log("[Auth Backend] User not found in MongoDB");
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        console.log(`[Auth Backend] User found: ${user.name} (${user.email})`);

        let isMatch = false;
        if (user.password.startsWith("$2a$") || user.password.startsWith("$2b$")) {
            isMatch = await bcrypt.compare(password, user.password);
        } else {
            // Safe fallback for any older legacy accounts, and securely upgrade to bcrypt hash
            if (user.password === password) {
                isMatch = true;
                user.password = await bcrypt.hash(password, 10);
                await user.save();
                console.log("[Auth Backend] Upgraded legacy password to secure bcrypt hash");
            }
        }

        if (!isMatch) {
            console.log("[Auth Backend] Password verification failed");
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        console.log("[Auth Backend] Authentication successful. Generating JWT token...");
        const token = jwt.sign(
            { userId: user._id, role: user.role || "USER" },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                status: user.status,
                role: user.role || "USER"
            }
        });
    } catch (error) {
        console.error("[Auth Backend] Login error:", error.message);
        res.status(500).json({
            message: "Login failed"
        });
    }
};

module.exports = { loginUser };