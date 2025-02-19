import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { RequestValidationError } from "../errors/requestValidationErrors";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errorsResult = validationResult(req);
  if (!errorsResult.isEmpty()) {
    throw new RequestValidationError(errorsResult.array());
  }

  next();
};
