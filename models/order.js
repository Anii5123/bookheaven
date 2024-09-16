const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",  // Refer to 'User' model
        required: true,
    },
    book: {
        type: mongoose.Types.ObjectId,
        ref: "Book",  // Refer to 'Book' model
        required: true,
    },
    status: {
        type: String,
        default: "Order Placed",
        enum: ["Order Placed", "Out for Delivery", "Canceled", "Delivered"],
    },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
