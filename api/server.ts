import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/users.routes";
import authRoutes from "./routes/auth.routes";
import passport from "passport";
import session from "express-session";

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello world" });
});

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(
  session({
    secret: "sfjsldkfjsldfkjlsdkj", // Keep this secret in your .env file
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Use 'true' in production (requires HTTPS)
      maxAge: 24 * 60 * 60 * 1000, // 1 day session expiry
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    // app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
    // });
  })
  .catch((e) => {
    console.log(e);
  });
