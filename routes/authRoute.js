const express = require("express")
const authRouter = express.Router()

const {
    createUserMiddleware,
    loginUserMiddleware,
    logoutUserMiddleware
} = require("../middlewares/authMiddleware")

const {
    createUserController,
    loginUserController,
    logoutUserController,
    getMeController
} = require("../controllers/authController")

const { 
    authenticate 
} = require("../utils/auth")


authRouter.post("/register",createUserMiddleware,createUserController)
authRouter.post("/login",loginUserMiddleware,loginUserController)
authRouter.post('/logout',logoutUserMiddleware,logoutUserController)
authRouter.get("/me",authenticate,getMeController)


module.exports = { authRouter }
