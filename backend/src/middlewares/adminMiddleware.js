function isAdmin(req, res, next) {
    try {
        if (!req.user) return res.status(401).json({ ERROR: "Not authenticated" });

        if (req.user.role && req.user.role === "ADMIN") {
            return next();
        }

        return res.status(403).json({ ERROR: "Admin access required" });
    } 
    catch (err) {
        console.error("isAdmin error:", err);
        return res.status(500).json({ ERROR: "Server error" });
    }
};

module.exports = { isAdmin }