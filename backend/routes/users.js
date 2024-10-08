const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/users.js");
const mailer = require("../utils/mailer.js");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const authenticate = require("../utils/ForgetAuth.js");
const path = require('path')
const JWT_SECRET = "SHY23FDA45G2G1K89KH5sec4H8KUTF85ret";

router.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600000,
    },
  })
);

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

router.post("/register", async function (req, res) {
  try {
    const { name, email, username, password, phoneNumber, confirm_password } =
      req.body;

    if (password !== confirm_password) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists, choose another" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
   const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    const newUser = new User({
      name: name,
      email: email,
      username: username,
      password: hash,
      phoneNumber: phoneNumber,
      admin: 0,
    });
    await newUser.save();

    await mailer(
      email,
      "reg",
      "Welcome to Raattai and happy purchasing. Please confirm your registration by login to http://3.6.184.48:3000/login"
    );

    res.json({ success: "You will receive an email notification.",token: token});
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", async function (req, res) {
  const { identifier, password } = req.body; // Using 'identifier' for either email or username

  try {
    // Find user by either email or username
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid identifier or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid identifier or password" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    req.session.token = token;

    res.json({
      message: "Login successful",
      user: user,
      token: token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/logout", async function (req, res) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "You are not logged in" });
    }

    jwt.verify(token, JWT_SECRET, function (err, decoded) {
      if (err) {
        return res.status(401).json({ error: "Invalid token" });
      }

      req.session.destroy(function (err) {
        if (err) {
          console.error("Error destroying session:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        res.json({ message: "You are logged out!" });
      });
    });
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/get-user", (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, JWT_SECRET, function (err, decoded) {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    User.findById(decoded.userId, function (err, user) {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json({ user });
    });
  });
});

// Route to initiate password reset
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const OTP = generateOTP();
    await mailer(
      email,
      "Password Reset OTP",
      `Your OTP for password reset is: ${OTP}`,
      `Your OTP for password reset is: <b>${OTP}</b>`
    );

    const token = jwt.sign({ email, OTP }, JWT_SECRET, { expiresIn: "15m" });
    res.json({ token });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Error sending email" });
  }
});

router.post("/verify-otp", authenticate, async (req, res) => {
  try {
    const { OTP } = req.body;

    if (req.OTP !== parseInt(OTP)) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    const user = await User.findOne({ email: req.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "OTP verified. You can now reset your password." });
  } catch (error) {
    console.error(error);
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return res.status(401).json({ error: "Invalid or expired token" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

// Route to reset password
router.post("/reset-password", authenticate, async (req, res) => {
  try {
    const { newPassword } = req.body;
    const user = await User.findOne({ email: req.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);
    user.password = hash;
    await user.save();
    res.json({ message: "Password reset successfully. Please log in again." });
  } catch (error) {
    console.error(error);
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return res.status(401).json({ error: "Invalid or expired token" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

router.post("/verify-token", (req, res) => {
  const token = req.headers.authorization.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
    res.json({ message: "Token is valid" });
  });
});


module.exports = router;
