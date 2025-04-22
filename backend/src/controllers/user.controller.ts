import { Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import { generateAccessToken } from "../utils/generateTokens";

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

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) throw new Error("All fields are required");

    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({
        success: false,
        message: "User not found",
      });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect)
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });

    const accessToken = generateAccessToken({
      _id: user._id,
      email: user.email,
    });

    const refreshToken = generateAccessToken({
      _id: user._id,
      email: user.email,
    });

    user.refreshToken = refreshToken;

    await user.save();

    return res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
        message: "Login in successful",
      });
  } catch (error) {
    console.error("Login user error :: ", error);
    res.status(500).json({
      success: false,
      message: "Login user error",
    });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    res.clearCookie("accessToken").clearCookie("refreshToken");

    if (req.user) {
      const user = await User.findById(req.user?._id);

      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Logged out successful",
    });
  } catch (error) {
    console.error("Logout user error :: ", error);
    res.status(500).json({
      success: false,
      message: "Logout user error",
    });
  }
};
