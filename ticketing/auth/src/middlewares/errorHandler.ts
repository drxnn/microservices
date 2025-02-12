import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { CustomError } from "../errors/customError";

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).send({ errors: err.serializeErrors() });
    return;
  }

  res.status(400).send({ errors: [{ message: "Something went wrong" }] });
};
