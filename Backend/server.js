require("dotenv").config();

const app = require("./src/app");
const connectToDB = require("./src/config/database");

app.use(async (req, res, next) => {
    try {
        await connectToDB();
        next();
    } catch (error) {
        console.error("MongoDB connection error:", error);
        res.status(500).json({
            message: "Database connection failed",
        });
    }
});

module.exports = app;