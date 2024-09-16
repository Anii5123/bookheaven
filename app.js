const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config();
const conn = require("./conn/conn"); // DB connection
conn(); // Ensure DB is connected

const userRoutes = require("./routes/user");
const bookRoutes = require("./routes/book");
const favouriteRoutes = require("./routes/favourite");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");

app.use(cors());
app.use(express.json());

// // Import routes
// const userRoutes = require("./routes/user");

// Routes
app.use("/api/v1", UserRoutes);
app.use("/api/v1", bookRoutes);
app.use("/api/v1", favouriteRoutes);
app.use("/api/v1", cartRoutes);
app.use("/api/v1", orderRoutes);



// Port creation
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
