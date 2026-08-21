const mongoose = require("mongoose");

let isConnected = false;

async function connectToDB() {
    if (isConnected && mongoose.connection.readyState === 1) {
        return;
    }

    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
        });

        isConnected = connection.connection.readyState === 1;

        console.log("Connected to Database");
    } catch (err) {
        isConnected = false;
        console.error("Database connection failed:", err.message);
        throw err;
    }
}

module.exports = connectToDB;