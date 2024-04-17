import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  last_name: String,
  city: String,
  email: String,
  password: String,
  created_at: Date,
});

export const UserModel = mongoose.model("user", userSchema);
