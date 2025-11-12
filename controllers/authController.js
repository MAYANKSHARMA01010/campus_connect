const { prisma } = require("../config/database");
const { createToken } = require("../utils/auth");
const bcrypt = require("bcrypt");


async function createUserController(req, res) {
    let { name, username, email, password } = req.body;

    try {
        name = name.trim();
        username = username.trim().toLowerCase();
        email = email.trim().toLowerCase();

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: { name, username, email, password: hashedPassword },
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser.id,
                name: newUser.name,
                username: newUser.username,
                email: newUser.email,
            },
        });
    } 
    catch (err) {
        console.error("CreateUser error:", err);
        return res.status(500).json({ ERROR: "Internal Server Error while creating user" });
    }
}


async function loginUserController(req, res) {
    let { email, username, password } = req.body;

    try {
        if (email) email = email.trim().toLowerCase();
        if (username) username = username.trim().toLowerCase();

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    email ? { email } : undefined,
                    username ? { username } : undefined,
                ].filter(Boolean),
            },
        });

        if (!user) {
            return res.status(404).json({ ERROR: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ ERROR: "Invalid credentials" });
        }

        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            username: user.username,
        };

        const token = createToken(payload);

        console.log("Generated JWT Token:", token);

        return res.status(200).json({
            message: "Login successful ✅",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                username: user.username,
            },
        });
    } 
    catch (err) {
        console.error("Login Error:", err);
        return res.status(500).json({ ERROR: "Internal Server Error" });
    }
}


async function logoutUserController(req, res) {
    try {
        return res.status(200).json({ message: "Logout successful" });
    } 
    catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ ERROR: "Logout failed" });
    }
}


async function getMeController(req, res) {
    try {
        const userId = req.user.id;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, username: true, email: true, gender: true },
        });

        if (!user) return res.status(404).json({ ERROR: "User not found" });

        return res.status(200).json({ message: "User fetched successfully", user });
    } 
    catch (error) {
        console.error("GetMe error:", error);
        return res.status(500).json({ ERROR: "Internal Server Error" });
    }
}


async function updateUserController(req, res) {
    try {
        const userId = req.user.id;
        let { name, username, gender } = req.body;

        const updateData = {};

        if (name && name.trim()) updateData.name = name.trim();
        if (username && username.trim()) updateData.username = username.trim().toLowerCase();
        if (gender && gender.trim()) updateData.gender = gender.trim();

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ ERROR: "No valid fields provided for update" });
        }

        if (updateData.username) {
            const existingUser = await prisma.user.findFirst({
                where: {
                    username: updateData.username,
                    NOT: { id: userId },
                },
            });
            if (existingUser) {
                return res.status(400).json({ ERROR: "Username already taken" });
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                gender: true,
                updatedAt: true,
            },
        });

        return res.status(200).json({
            message: "✅ Profile updated successfully",
            user: updatedUser,
        });
    } 
    catch (err) {
        console.error("UpdateUser error:", err);
        return res.status(500).json({
            ERROR: "Internal Server Error while updating user",
        });
    }
}

module.exports = {
    createUserController,
    loginUserController,
    logoutUserController,
    getMeController,
    updateUserController,
};
