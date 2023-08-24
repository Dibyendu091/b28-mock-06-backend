const express = require("express");
const { UserModel } = require("../model/userModel");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Register a new user
userRouter.post("/register", async (req, res) => {
  const { name, email, avatar, password } = req.body;
  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ msg: "Email already exists" });
    }
    bcrypt.hash(password, 10, async (err, hash) => {
      // Increase the number of rounds for bcrypt
      const user = new UserModel({ name, email, avatar, password: hash });
      await user.save();
      res.status(201).send({ msg: "User registered successfully" });
    });
  } catch (err) {
    res.status(400).send({ err: err.message });
  }
});

// Login user
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).send({ msg: "User not found" });
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        const token = jwt.sign(
          { userID: user._id, name: user.name },
          "travelBlogs"
          // process.env.JWT_SECRET // Use your JWT secret key from .env
        );
        res.status(200).send({ msg: "Login successful", token });
      } else {
        res.status(401).send({ msg: "Invalid credentials" });
      }
    });
  } catch (err) {
    res.status(400).send({ err: err.message });
  }
});

module.exports = {
  userRouter,
};