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

export { app };
