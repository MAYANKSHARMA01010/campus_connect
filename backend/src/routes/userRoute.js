const express = require("express")
const userRouter = express.Router()
const rateLimit = require("express-rate-limit")

const {
    createUserMiddleware,
    loginUserMiddleware,
    logoutUserMiddleware,
    updateUserMiddleware,
} = require("../middlewares/userMiddleware")

const {
    createUserController,
    loginUserController,
    logoutUserController,
    getMeController,
    updateUserController,
    getAllUsers,
} = require("../controllers/userController")

const {
    authenticate
} = require("../utils/auth")

const userLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs for user routes
})

userRouter.post("/register", userLimiter, createUserMiddleware, createUserController)
userRouter.post("/login", userLimiter, loginUserMiddleware, loginUserController)
userRouter.post('/logout', userLimiter, logoutUserMiddleware, logoutUserController)
userRouter.get("/me", userLimiter, authenticate, getMeController)
userRouter.put("/update", userLimiter, authenticate, updateUserMiddleware, updateUserController);
userRouter.get("/", userLimiter, getAllUsers)








module.exports = userRouter;
