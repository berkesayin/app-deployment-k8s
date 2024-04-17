import express from "express";
import { UserModel } from "../models/UserModel";

export const router = express.Router();

// @desc     Create new user
// @route    POST /api/user/createUser
// @access   Public route (No token needed)

router.post("/createUser", (req, res) => {
  const user = new UserModel({
    ...req.body,
    created_at: new Date(),
  });

  user
    .save()
    .then((createdUser) => res.status(200).json(createdUser))
    .catch((e) => res.status(400).json(e));
});

// @desc     Get all users
// @route    GET /api/user/getUsers
// @access   Public route (No token needed)

router.get("/getUsers", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
