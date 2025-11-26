const express = require("express")
const userRouter = express.Router()

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
} = require("../controllers/userController")

const { 
    authenticate 
} = require("../utils/auth")


userRouter.post("/register",createUserMiddleware,createUserController)
userRouter.post("/login",loginUserMiddleware,loginUserController)
userRouter.post('/logout',logoutUserMiddleware,logoutUserController)
userRouter.get("/me",authenticate,getMeController)
userRouter.put("/update", authenticate, updateUserMiddleware, updateUserController);

// Future addition ROUTES :-
// /refresh
// /change-password
// /forgot-password
// /reset-password/:token
// /delete

module.exports = userRouter;
  