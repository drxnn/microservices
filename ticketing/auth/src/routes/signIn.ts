import express from "express";

const router = express.Router();
router.get("/api/users/signIn", (req, res) => {
  res.send("hi there fam");
});

export { router as signInRouter };
