function isAdmin(req, res, next) {
    if (req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Admin access required" });
    }
    next();
}

module.exports = { isAdmin };
