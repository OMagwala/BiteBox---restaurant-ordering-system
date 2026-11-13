const jwt = require("jsonwebtoken");

function protect(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({
            message: "Authentication required. Please login.",
        });
    }

    const token = authHeader.split(" ")[1];
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not configured.");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            userId: decoded.userId,
            role: decoded.role,
        };

        next();
    }catch (error) {
        if (error.message === "JWT_SECRET is not configured.") {
            console.error(error.message);

            return res.status(500).json({
                message: "Authentication service is not configured.",
            });
        }

        return res.status(401).json({
            message: "Invalid or expired token. Please login again.",
        });
    }
}

function optionalProtect(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return next();
    }

    return protect(req, res, next);
}

function authorizeAdmin(req, res, next) {
    if (!req.user) {
        return res.status(401).json({
            message: "Authentication required. Please log in.",
        });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Access denied. Admin privileges required.",
        });
    }

    next();
}


module.exports = { protect, optionalProtect, authorizeAdmin };