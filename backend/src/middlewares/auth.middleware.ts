import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user.model";

export const validateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get the token
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token)
      return res.status(400).json({
        success: false,
        message: "Unauthorized request",
      });

    // verify token
    const decodedToken = jwt.verify(
      token,
      String(process.env.ACCESS_TOKEN_SECRET)
    ) as JwtPayload;

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user)
      return res.status(400).json({
        success: false,
        message: "Unauthorized request",
      });

    req.user = {
      _id: user._id,
      email: user.email,
      username: user.username,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error :: ", error);
    res.status(500).json({
      success: false,
      message: "Auth middleware error",
    });
  }
};
