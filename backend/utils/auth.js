const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET = process.env.JWT_SECRET;
if (!SECRET) throw new Error("❌ JWT_SECRET not set in environment");


function createToken(payload) {
    return jwt.sign(payload, SECRET, {
        algorithm: "HS256",
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
}


function verifyToken(token) {
    try {
        return jwt.verify(token, SECRET);
    } 
    catch (err) {
        throw err;
    }
}


async function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ ERROR: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } 
    catch (err) {
        return res.status(401).json({
            ERROR:
                err.name === "TokenExpiredError"
                ? "Token expired"
                : "Invalid or expired token",
        });
    }
}


module.exports = {
    createToken,
    verifyToken,
    authenticate,
};
