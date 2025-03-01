import { app } from "./app";
import mongoose from "mongoose";

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
