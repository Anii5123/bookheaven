const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./userAuth");

// Sign-up route
router.post("/sign-up", async (req, res) => {
  try {
    const { username, email, password, address } = req.body;

    // Username validation
    if (username.length < 4) {
      return res
        .status(400)
        .json({ msg: "Username must be at least 4 characters" });
    }

    // Check if username exists
    const existingUsername = await User.findOne({ username: username });
    if (existingUsername) {
      return res.status(400).json({ msg: "Username already exists!" });
    }

    // Email validation
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail(email)) {
      return res.status(400).json({ msg: "Invalid email format" });
    }

    // Check if email exists
    const existingEmail = await User.findOne({ email: email });
    if (existingEmail) {
      return res.status(400).json({ msg: "Email already exists!" });
    }

    // Password validation
    if (password.length < 8) {
      return res
        .status(400)
        .json({ msg: "Password must be at least 8 characters" });
    }
    if (!/^[A-Z]/.test(password)) {
      return res
        .status(400)
        .json({ msg: "Password must start with a capital letter" });
    }
    if (!/\d/.test(password)) {
      return res
        .status(400)
        .json({ msg: "Password must include at least one number" });
    }
    if (!/[a-zA-Z]/.test(password)) {
      return res
        .status(400)
        .json({ msg: "Password must include at least one letter" });
    }
    if (!/[@_#]/.test(password)) {
      return res
        .status(400)
        .json({
          msg: "Password must include at least one of the following signs: @, _, #",
        });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword,
      address: address,
    });
    await newUser.save();
    return res.status(200).json({ msg: "Sign-up successful!" });
  } catch (error) {
    console.error("Error occurred during sign-up:", error); // Log the error for debugging
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

// Sign-in route
router.post("/sign-in", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (isMatch) {
      const authClaims = { id: existingUser._id, role: existingUser.role }; // Adjusted claims
      const token = jwt.sign(authClaims, "bookstore123", { expiresIn: "1d" });
      res
        .status(200)
        .json({ id: existingUser._id, role: existingUser.role, token });
    } else {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }
  } catch (error) {
    console.error("Error occurred during sign-in:", error); // Log the error for debugging
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

// Get user information
router.get("/get-user-information", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const data = await User.findById(id).select("-password");
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

// Update address
router.put("/update-address", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { address } = req.body;
    await User.findByIdAndUpdate(id, { address: address });
    return res.status(200).json({ msg: "Address Updated Successfully" });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

module.exports = router;
