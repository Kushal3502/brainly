import cookieParser from "cookie-parser";
import cors from "cors";
import express, { urlencoded } from "express";

const app = express();

app.use(
  cors({
    origin: process.env.CORS,
    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());

app.use(urlencoded({ limit: "16kb", extended: true }));

// routes

export default app;
