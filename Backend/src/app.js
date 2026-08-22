const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const connectToDB = require("./config/database");

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(
    cors({
        origin: "https://interviewai-frontend-ashy.vercel.app",
        credentials: true,
    })
);

app.use(async (req, res, next) => {
    try {
        await connectToDB();
        next();
    } catch (error) {
        console.error("MongoDB connection error:", error.message);

        res.status(500).json({
            message: "Database connection failed",
        });
    }
});

const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

module.exports = app;