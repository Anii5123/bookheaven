const router = require("express").Router();
const User = require("../models/User");
// const bcrypt = require('bcryptjs');
const Book = require("../models/book")
const jwt = require("jsonwebtoken");
const {authenticateToken} = require("./userAuth");

//add book (admin)

router.post("/add-book", authenticateToken, async (req, res) => {
    try {
        const {id} = req.headers;
        const user = await User.findById(id);
        if (user.role !== "admin") {
            return res.status(400).json({ msg: "You are not having access to perform admin work" });
        }
        const book = new Book({
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            desc: req.body.desc,
            language: req.body.language,
        });
        await book.save();
        res.status(200).json({ msg:"Book Added Successfully..!" });
    } catch (error) {
        return res.status(500).json({ msg: "Internal Server Error" }); 
    }
});

router.put("/update-book", authenticateToken, async (req, res) => {
    try {
        const {bookid} = req.headers;
        await Book.findByIdAndUpdate(bookid,{
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            desc: req.body.desc,
            language: req.body.language,
        });
        return res.status(200).json({ msg:"Book Updated Successfully..!" });

    } catch (error) {
        return res.status(500).json({ msg: "An Error Occured" }); 
    }
});

router.delete("/delete-book", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.headers;
        await Book.findByIdAndDelete(bookid);
        return res.status(200).json({ msg: "Book Deleted Successfully..!" })
    } catch (error) {
        return res.status(500).json({ msg: "An Error Occured" }); 
    }
});

//for public or user

router.get("/get-all-books", async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        return res.json({
            status: "Success",
            data: books,
        })
    } catch (error) {
        return res.status(500).json({ msg: "An Error Occured" }); 
    }
});

router.get("/get-recent-books", async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 }).limit(4);
        return res.json({
            status: "Success",
            data: books,
        })
    } catch (error) {
        return res.status(500).json({ msg: "An Error Occured" }); 
    }
});

router.get("/get-book-by-id/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const book = await Book.findById(id);
        return res.json({
            status: "Success",
            data: books,
        })
    } catch (error) {
        return res.status(500).json({ msg: "An Error Occured" }); 
    }
});

module.exports = router;