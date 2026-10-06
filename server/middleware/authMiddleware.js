const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Not authorized, token missing"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            id: decoded.userId,
            role: decoded.role || "USER"
        };

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Not authorized, invalid token"
        });
    }
};

/**
 * Role-based authorization middleware (Experiment 6)
 * Usage: requireRole("ADMIN")
 */
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({
                message: "Not authorized, user information missing"
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Forbidden: You do not have permission to access this resource"
            });
        }

        next();
    };
};

module.exports = {
    protect,
    requireRole
};