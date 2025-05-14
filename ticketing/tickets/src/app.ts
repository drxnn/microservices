import express from "express";
import { json } from "body-parser";
import "express-async-errors";

import { errorHandler, NotFoundError } from "@drxnnticketslibrary/common";

import cookieSession from "cookie-session";

const app = express();
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secureProxy: true,
  })
);

app.all("*", async (req, res, next) => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
