import express from "express";
import jwt from "jsonwebtoken";
import {z} from "zod";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { middleware } from "./middleware";

dotenv.config();

const app = express();
app.use(express.json());


app.post("/signup",  (req, res) => {
    res.json({
      "message": "Signup successful"
    })
});


app.post("/signin", async (req, res) => {
  const userId = 1;
  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string);
  res.json({
    message: "Sign in successful",
    token: token,
  });
});


app.post("/room", middleware, (req, res) => {
  res.json({
    message: "Room created successfully",
  }); 
});


app.listen(3001);