const { prisma } = require("../config/database");

async function createUserMiddleware(req, res, next) {
    try {
        let { name, username, email, password, confirm_password } = req.body;

        if (!name || !username || !email || !password || !confirm_password) {
            return res.status(400).json({ ERROR: "All fields are required" });
        }

        name = name.trim();
        username = username.trim().toLowerCase();
        email = email.trim().toLowerCase();

        if (password !== confirm_password) {
            return res.status(400).json({ ERROR: "Password and Confirm Password do not match" });
        }

        if (password.length < 8) {
            return res.status(400).json({ ERROR: "Password must be at least 8 characters long" });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ ERROR: "Invalid email format" });
        }

        if (username.length < 3) {
            return res.status(400).json({ ERROR: "Username must be at least 3 characters long" });
        }

        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return res.status(400).json({ ERROR: "Username can only contain letters, numbers, and underscores" });
        }

        if (!/^[a-zA-Z\s]+$/.test(name)) {
            return res.status(400).json({ ERROR: "Name should contain only letters and spaces" });
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username },
                ],
            },
        });

        if (existingUser) {
            return res.status(400).json({ ERROR: "Email or Username already exists" });
        }

        req.body = { name, username, email, password };
        next();
    }
    catch (err) {
        console.error("🔥 Error in createUserMiddleware:", err);
        return res.status(500).json({
            ERROR: "Something went wrong while checking user details. Please try again later.",
        });
    }
}

async function loginUserMiddleware(req, res, next) {
    try {
        let { email, username, password } = req.body;

        if ((!email && !username) || !password) {
            return res.status(400).json({
                ERROR: "Email or Username and Password are required",
            });
        }

        if (email) email = email.trim().toLowerCase();
        if (username) username = username.trim().toLowerCase();

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                ERROR: "Invalid email format",
            });
        }

        if (username && username.length < 3) {
            return res.status(400).json({
                ERROR: "Username must be at least 3 characters long",
            });
        }

        req.body = { email, username, password };
        next();
    }
    catch (err) {
        console.error("Error in loginUserMiddleware:", err);
        return res.status(500).json({ ERROR: "Internal Server Error" });
    }
}

async function logoutUserMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(400).json({ ERROR: "No token provided" });
        }
        next();
    } catch (err) {
        console.error("Error in logoutUserMiddleware:", err);
        return res.status(500).json({ ERROR: "Internal Server Error" });
    }
}

async function updateUserMiddleware(req, res, next) {
    try {
        let { name, username, gender, email, password } = req.body;

        if (email || password) {
            return res.status(400).json({
                ERROR: "Email and password updates are not allowed through this route.",
            });
        }

        if (!name && !username && !gender) {
            return res.status(400).json({
                ERROR: "At least one of name, username, or gender must be provided.",
            });
        }

        if (username) username = username.trim().toLowerCase();
        if (name) name = name.trim();

        if (username && username.length < 3) {
            return res.status(400).json({
                ERROR: "Username must be at least 3 characters long",
            });
        }

        if (name && !/^[a-zA-Z\s]+$/.test(name)) {
            return res.status(400).json({
                ERROR: "Name should only contain letters and spaces",
            });
        }

        req.body = { name, username, gender };
        next();
    }
    catch (err) {
        console.error("Error in updateUserMiddleware:", err);
        return res.status(500).json({ ERROR: "Internal Server Error" });
    }
}

module.exports = {
    createUserMiddleware,
    loginUserMiddleware,
    logoutUserMiddleware,
    updateUserMiddleware,
};
