const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,  // Ensure price is not negative
    },
    desc: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("Book", bookSchema);
