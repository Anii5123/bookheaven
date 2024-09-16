const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require('dotenv').config();
const conn = require("./conn/conn"); // DB connection
conn(); // Ensure DB is connected

// Import routes
const userRoutes = require("./routes/user");
const bookRoutes = require("./routes/book");
const favouriteRoutes = require("./routes/favourite");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser()); // Ensure cookie-parser is imported and used

// Routes
app.use("/api/v1", userRoutes);
app.use("/api/v1", bookRoutes);
app.use("/api/v1", favouriteRoutes);
app.use("/api/v1", cartRoutes);
app.use("/api/v1", orderRoutes);

// Port creation
const PORT = process.env.PORT || 3000; // Fallback to port 3000 if PORT is not defined
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
