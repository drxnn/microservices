import express from "express";
import { json } from "body-parser";
import "express-async-errors";
import { currentUserRouter } from "./routes/currentUser";
import { signInRouter } from "./routes/signIn";
import { signOutRouter } from "./routes/signOut";
import { signUpRouter } from "./routes/signUp";
import { errorHandler } from "./middlewares/errorHandler";
import { NotFoundError } from "./errors/notFoundError";
import cookieSession from "cookie-session";
import mongoose from "mongoose";
const app = express();
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secureProxy: true,
  })
);

app.use(currentUserRouter);
app.use(signUpRouter);
app.use(signOutRouter);
app.use(signInRouter);

app.all("*", async (req, res, next) => {
  throw new NotFoundError();
});
app.use(errorHandler);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY MUST BE DEFINED");
  }
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("connected to mongodb");
  } catch (err) {
    console.error(err);
  }
  app.listen(3000, () => {
    console.log("listening on 3000 ok!!!");
  });
};

start();
