import express, { Request, Response } from "express";
import { body } from "express-validator";

import jwt from "jsonwebtoken";

import { User } from "../models/user";
import { BadRequestError, validateRequest } from "@drxnnticketslibrary/common";

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
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const userFound = await User.findOne({ email: email });

    if (userFound) {
      throw new BadRequestError("Email in use");
    }

    /// create
    const user = User.build({ email, password });
    const savedUser = await user.save();
    //GENERATE A JWT HERE
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      // using ! below because JWT key is checked in index.ts befeore app runs
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userJwt,
    };

    //STORE IN SESSION
    res.status(201).send(savedUser);
  }
);

export { router as signUpRouter };
