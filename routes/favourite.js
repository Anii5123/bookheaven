const router = require("express").Router();
const User = require("../models/User");
const { authenticateToken } = require("./userAuth");

// add book to favourites
router.put("/add-book-to-favourite", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isBookFavourite = userData.favourites.includes(bookid);
    if (isBookFavourite) {
      return res.status(200).json({ msg: "Book is already in Favourites..!" });
    }
    await User.findByIdAndUpdate(id, { $push: { favourites: bookid } });
    return res.status(200).json({ msg: "Book Added to Favourites..!" });
  } catch (error) {
    return res.status(500).json({ msg: "An Error Occured" });
  }
});

//delete book  to favourites
router.put("/remove-favourite-books", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isBookFavourite = userData.favourites.includes(bookid);
    if (isBookFavourite) {
      await User.findByIdAndUpdate(id, { $pull: { favourites: bookid } });
    }

    return res.status(200).json({ msg: "Book Removed From Favourites..!" });
  } catch (error) {
    return res.status(500).json({ msg: "An Error Occured" });
  }
});

//get fav books of a particular user
router.get("/get-book-from-favourite", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id).populate("favourites");
    const favouriteBooks = userData.favourites;
    return res.json({
      status: "Success",
      data: favouriteBooks,
    });
  } catch (error) {
    return res.status(500).json({ msg: "An Error Occured" });
  }
});

module.exports = router;
