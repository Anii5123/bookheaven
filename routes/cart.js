const router = require("express").Router();
const User = require("../models/User");
const { authenticateToken } = require("./userAuth");

//add book to cart
router.put("/add-to-cart", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isBookinCart = userData.cart.includes(bookid);
    if (isBookinCart) {
      return res.json({
        status: "Success",
        msg: "Book is Already in Cart..!",
      });
    }
    await User.findByIdAndUpdate(id, {
      $push: { cart: bookid },
    });

    return res.json({
      status: "Success",
      msg: "Book Added to Cart..!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "An Error Occured.." });
  }
});

//remove from cart
router.put("/remove-from-cart/:bookid", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.params;
    const { id } = req.headers;

    await User.findByIdAndUpdate(id, {
      $pull: { cart: bookid },
    });

    return res.json({
      status: "Success",
      msg: "Book Removed from Cart..!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "An Error Occured.." });
  }
});

//get cart of a particular user
router.get("/get-user-cart", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;

        if (!id) {
            return res.status(400).json({ msg: "User ID is required" });
        }

        const userData = await User.findById(id).populate("cart");

        if (!userData) {
            return res.status(404).json({ msg: "User not found" });
        }

        const cart = userData.cart.reverse();

        return res.json({
            status: "Success",
            data: cart,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "An Error Occurred.." });
    }
});


module.exports = router;
