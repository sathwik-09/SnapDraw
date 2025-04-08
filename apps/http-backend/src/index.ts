import dotenv from "dotenv"
dotenv.config({path: '../../.env'});
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { middleware } from "./middleware";
import {SigninSchema, SignupSchema, CreateRoomSchema} from "@repo/common/types"
import { prismaClient } from "@repo/db/client";
import { Request, Response } from "express"; 
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const saltRounds = 10; 

app.post("/signup",  async(req, res) => {
  const parsedData = SignupSchema.safeParse(req.body);
  if(!parsedData.success) {
    res.json({
      message: "Incorrect inputs"
    })
    return;
  }
  try {
    const hashedPassword = await bcrypt.hash(parsedData.data?.password!, saltRounds);
    const user = await prismaClient.user.create({
      data: {
        username: parsedData.data?.username,
        email: parsedData.data?.email,
        password: hashedPassword
      }
    })
    res.json({
      userId: user.id
    })
  }
  catch(e) {
    res.status(411).json({
      message: "User already exists with this username"
    })
  }
});


app.post("/signin", async (req: Request, res: Response) => {
  const parsedData = SigninSchema.safeParse(req.body);
  if(!parsedData.success) {
    res.status(400).json({
      message: "Incorrect inputs"
    })
    return;
  }

  try{
    const user = await prismaClient.user.findFirst({
      where:{
        email: parsedData.data?.email
      }
    })
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }
    const isPasswordValid = await bcrypt.compare(parsedData.data?.password, user.password);

    if(isPasswordValid) {
      const payload = {
        userId: user.id
      }
      const token = jwt.sign(payload, process.env.JWT_SECRET as string);
      res.json({
        message: "signin successful",
        token: token
      })
    }
    else {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
  }
  catch(e){
    res.status(500).json({
      message: "Oops..!! Something went wrong"
    })
  }
});


app.post("/room", middleware, async (req, res) => {
  const parsedData = CreateRoomSchema.safeParse(req.body);
  if(!parsedData.success) {
    res.json({
      message: "Incorrect inputs"
    })
    return;
  }
  //@ts-ignore
  const userId = req.userId;

  try {
    const room = await prismaClient.room.create({
      data: {
        slug: parsedData.data.name,
        adminId: userId
      }
    })
    res.json({
      roomId: room.id
    }); 
  } 
  catch(e) {
    res.status(500).json({
      message: "Room already exists with this name"
    })
  }
});


app.get("/chats/:roomId", async (req: Request, res: Response) =>{
  try {
    
    const roomId = Number(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
      where: {
        roomId: roomId
      },
      orderBy:{
        id: "desc"
      },
      take: 50
    })
    res.json({
      messages
    })
  }
  catch(e) {
    console.error(e);
    message: {"oops"}
  }

}) 

app.get("/room/:slug", async (req: Request, res: Response) =>{
  const slug = req.params.slug;
  const room = await prismaClient.room.findFirst({
    where: {
      slug
    }
  })
  res.json({
    room
  })

}) 


app.listen(3001);