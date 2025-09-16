const express = require("express");
const cors= require("cors");
const db = require("./utils/db.js");
const userRouter = require("./routes/userRoutes.js");

const cookieParser = require("cookie-parser");
const questionRouter = require("./routes/questionRoutes.js");
const { quizRouter } = require("./routes/quizRoutes.js");
const app = express();
const PORT = process.env.PORT || 3001;

//express Middleware

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

app.use(cookieParser());
//db connection
db();

//routes middleware
app.use("/api/v1/users",userRouter);
app.use("/api/v1/questions", questionRouter);
app.use("/api/v1/quiz/",quizRouter);
//connect server
app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT} 😃...`);
});