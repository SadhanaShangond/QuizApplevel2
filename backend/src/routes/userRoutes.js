const express = require("express")
const {
    register,
    login,
    quizAttempts
} = require("../controllers/userController.js");
const authenticateUser = require("../middleware/authenticateUser.js");

const userRouter = express.Router();

userRouter.post("/register",register);
userRouter.post("/login", login);

userRouter.get("/quiz-attempts",authenticateUser,quizAttempts);

module.exports=userRouter;
