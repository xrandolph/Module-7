const express = require("express");
const router = express.Router();

const jwt = require("jwt-simple");
const User = require("../models/users");

const secret = "super secret";

// ✅ REGISTER (Create User)
router.post("/user", async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ error: "missing username or password" });
  }

  try {
    // optional: check uniqueness like transcript suggested
    const existing = await User.findOne({ username: req.body.username });
    if (existing) {
      return res.status(400).json({ error: "user already exists" });
    }

    const newUser = new User({
      username: req.body.username,
      password: req.body.password,
      status: req.body.status || "loggedout"
    });

    await newUser.save();
    return res.sendStatus(201);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// LOGIN (Auth) -> returns token, username2, auth=1
router.post("/auth", async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ error: "missing username or password" });
  }

  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(401).json({ error: "bad username" });
    }

    if (user.password !== req.body.password) {
      return res.status(401).json({ error: "bad password" });
    }

    // transcript encodes username using secret
    const username2 = user.username;
    const token = jwt.encode(user.username, secret);
    const auth = 1;

    user.status = "loggedin";
    await user.save();

    return res.json({ username2, token, auth });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

//  STATUS (Protected) -> requires x-auth header
router.get("/status", async (req, res) => {
  if (!req.headers["x-auth"]) {
    return res.status(401).json({ error: "missing x-auth" });
  }

  const token = req.headers["x-auth"];

  try {
    // decode validates token
    jwt.decode(token, secret);

    const users = await User.find({}, { username: 1, status: 1 });
    return res.json(users);
  } catch (ex) {
    return res.status(401).json({ error: "invalid token" });
  }
});

module.exports = router;
