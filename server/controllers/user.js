import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv";
dotenv.config();

export const signin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(404)
      .json({ message: "Please provide your email and password" });
  }
  try {
    const existingUser = await User.findOne({ email }).select("+password");
    if (!existingUser)
      return res.status(404).json({ message: "email not found" });

    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword)
      return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    // remove password from output
    existingUser.password = undefined;
    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: `something went wrong ${error.message}` });
  }
};
export const register = async (req, res) => {
  const { email, password, firstName, lastName, confirmPassword } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists." });
    // if (password !== confirmPassword)
    //   return res.status(400).json({ message: "Password does not match." });

    // const salt = await bcrypt.genSalt(12);
    // const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email,
      password,
      confirmPassword,
      name: `${firstName} ${lastName}`,
    });
    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // remove password from output
    newUser.password = undefined;
    res.status(201).json({ result: newUser, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

// export const register = async (req, res) => {
//   const { email, password, firstName, lastName, confirmPassword } = req.body;
//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser)
//       return res.status(400).json({ message: "User already exists." });
//     if (password !== confirmPassword)
//       return res.status(400).json({ message: "Password does not match." });

//     const salt = await bcrypt.genSalt(12);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newUser = await User.create({
//       email,
//       password: hashedPassword,
//       name: `${firstName} ${lastName}`,
//     });
//     const token = jwt.sign(
//       { email: newUser.email, id: newUser._id },
//       process.env.SECRET,
//       { expiresIn: "1h" }
//     );
//     res.status(201).json({ result: newUser, token });
//   } catch (error) {
//     res.status(500).json({ message: `something went wrong ${error.message}` });
//     console.log(error);
//   }
// };
