import express from "express";
import { currentUser } from "../middlewares/currentUser";

const router = express.Router();
router.get("/api/users/currentUser", currentUser, (req, res) => {
  res.status(200).send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
