import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/requestValidationErrors";

import { User } from "../models/user";
import { BadRequestError } from "../errors/badRequestError";

const router = express.Router();
router.post(
  "/api/users/signUp",
  [
    body("email").isEmail().withMessage("Email must be valid!"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4-20 characters"),
  ],
  async (req: Request, res: Response) => {
    const errorsResult = validationResult(req);
    if (!errorsResult.isEmpty()) {
      throw new RequestValidationError(errorsResult.array());
    }
    const { email, password } = req.body;
    const userFound = await User.findOne({ email: email });

    if (userFound) {
      throw new BadRequestError("Email in use");
    }

    /// create
    const user = User.build({ email, password });
    const savedUser = await user.save();
    res.status(201).send(savedUser);
  }
);

export { router as signUpRouter };
