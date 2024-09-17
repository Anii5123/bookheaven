const mongoose = require('mongoose');

const conn = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI); // Use MONGO_URI instead of URI
        console.log("Connected to Database..");
    } catch (error) {
        console.log("Database connection failed:", error);
        process.exit(1);  // Terminate the app if DB connection fails
    }
};

module.exports = conn;
