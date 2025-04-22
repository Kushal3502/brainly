import jwt from "jsonwebtoken";

interface User {
  _id: string;
  email: string;
}

export const generateAccessToken = (user: User) => {
  // @ts-ignore
  const token = jwt.sign(
    { _id: user._id, email: user.email },
    String(process.env.ACCESS_TOKEN_SECRET),
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );

  return token;
};

export const generateRefreshToken = (user: User) => {
  // @ts-ignore
  const token = jwt.sign(
    { _id: user._id, email: user.email },
    String(process.env.REFRESH_TOKEN_SECRET),
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );

  return token;
};
