import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { connectDB } from "../config/dbConfig";
import { router as userRoutes } from "../routes/userRoutes";

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello, server is up and running...");
});

app.listen(port, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${port}`
  );
});
