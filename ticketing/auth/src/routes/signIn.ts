import express, { Request, Response } from "express";
import { body } from "express-validator";
import { User } from "../models/user";

import jwt from "jsonwebtoken";

import { validateRequest, BadRequestError } from "@drxnnticketslibrary/common";
import { Password } from "../services/password";

const router = express.Router();
router.post(
  "/api/users/signIn",
  [
    body("email").isEmail().withMessage("Email must be valid!"),
    body("password").trim().notEmpty().withMessage("Must provide a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const userFound = await User.findOne({ email: email });

    if (!userFound) {
      throw new BadRequestError("Invalid Credentials");
    }
    const passwordCorrect = await Password.compare(
      userFound.password,
      password
    );
    if (!passwordCorrect) {
      throw new BadRequestError("Invalid Credentials");
    }

    const userJwt = jwt.sign(
      {
        id: userFound.id,
        email: userFound.email,
      },
      // using ! below because JWT key is checked in index.ts befeore app runs
      process.env.JWT_KEY!
    );
    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(userFound);
  }
);

export { router as signInRouter };
