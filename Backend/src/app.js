const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

// Middleware
app.use(express.json())
app.use(cookieParser())

// CORS - Local + Production Frontend
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://interviewai-frontend-ashy.vercel.app"
    ],
    credentials: true
}))

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

module.exports = app