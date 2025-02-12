import express from "express";

const router = express.Router();
router.get("/api/users/signOut", (req, res) => {
  res.send("hi there fam");
});

export { router as signOutRouter };
