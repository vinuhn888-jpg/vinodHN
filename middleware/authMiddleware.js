const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

    // Support both "Bearer <token>" and raw token formats
    const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : authHeader;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
        req.user = decoded; // ✅ attach user
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};