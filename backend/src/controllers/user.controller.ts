import { Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      throw new Error("All fields are required");

    // check user already exists with username or email
    const isUserAlreadyExists = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (isUserAlreadyExists)
      return res.status(400).json({
        success: false,
        message: "Email/username already exixts",
      });

    // hash password
    const hashPassword = await bcrypt.hash(password, 12);

    // create new user
    const newUser = await User.create({
      username,
      email,
      password: hashPassword,
    });

    const createdUser = await User.findById(newUser._id).select(
      "-password -refreshToken"
    );

    if (!createdUser)
      return res.status(400).json({
        success: false,
        message: "User not created",
      });

    return res.status(200).json({
      success: true,
      message: "User created successfully",
      user: createdUser,
    });
  } catch (error) {
    console.error("Register user error :: ", error);
    res.status(500).json({
      success: false,
      message: "Register user error",
    });
  }
};
