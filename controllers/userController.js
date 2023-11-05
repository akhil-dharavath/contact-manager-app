const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// @desc - resgister user
// @route - POST /api/users/register
// @access - public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const findUser = await User.findOne({ email });
  if (findUser) {
    res.status(400);
    throw new Error("User with this email already exists");
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashedPassword });
  if (user) {
    res.status(201).json({ username: user.username, email: user.email });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
});

// @desc - login user
// @route - POST /api/users/login
// @access - public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All files are mandatory");
  }
  const user = await User.findOne({ email });

  // compare hashed password
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user._id,
        },
      },
      process.env.JWT_SIGNATURE
      //   { expiresIn: "360m" }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("Invalid login credentials");
  }
});

// @desc - get current information
// @route - GET /api/users/current
// @access - private
const currentUser = asyncHandler(async (req, res) => {
  res.json({ username: req.user.username, email: req.user.email });
});

module.exports = { registerUser, loginUser, currentUser };
