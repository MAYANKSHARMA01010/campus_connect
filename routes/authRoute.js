const express = require("express")
const authRouter = express.Router()

const {
    createUserMiddleware,
    loginUserMiddleware,
    logoutUserMiddleware,
    updateUserMiddleware,
} = require("../middlewares/authMiddleware")

const {
    createUserController,
    loginUserController,
    logoutUserController,
    getMeController,
    updateUserController,
} = require("../controllers/authController")

const { 
    authenticate 
} = require("../utils/auth")


authRouter.post("/register",createUserMiddleware,createUserController)
authRouter.post("/login",loginUserMiddleware,loginUserController)
authRouter.post('/logout',logoutUserMiddleware,logoutUserController)
authRouter.get("/me",authenticate,getMeController)
authRouter.put("/update", authenticate, updateUserMiddleware, updateUserController);

// Future addition ROUTES :-
// /refresh
// /change-password
// /forgot-password
// /reset-password/:token
// /delete

module.exports = authRouter;
  