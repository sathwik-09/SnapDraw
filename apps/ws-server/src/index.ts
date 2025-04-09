import {WebSocketServer, WebSocket} from "ws";
import jwt, {JwtPayload} from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({path: '../../.env'});
import {prismaClient} from "@repo/db/client"

const wss = new WebSocketServer({port: 8080});


interface User {
  ws: WebSocket,
  rooms: string[],
  userId: string
}

const users: User[] = [];


function checkUser(token: string): string | null {
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    if(typeof decoded === 'string') {
      return null;
    }

    if(!decoded || !decoded.userId) {
      return null;
    }
    return decoded.userId;
  }
  catch(e) {
    return null;
  }

}


wss.on('connection', function connection(ws, request) {
  const url = request.url;
  if(!url) {
    return;
  }
  const queryparams = new URLSearchParams(url.split('?')[1]);
  const token = queryparams.get('token') || "";
  const userId = checkUser(token); 
  if(userId==null) {
    ws.close();
    return null;
  }

  users.push({
    userId,
    rooms: [],
    ws
  })
  
  ws.on('message', async function message(data) {
    
    try{
      let parsedData;
      if(typeof data !== "string") {
        parsedData = JSON.parse(data.toString());
      } else{
        parsedData = JSON.parse(data); 
      }
      const user = users.find((x) => x.ws === ws);
      if(!user) return;
      if(parsedData.type === "join_room") {
        user?.rooms.push(parsedData.roomId);
      }

      if(parsedData.type === "leave_room") {
        user.rooms = user?.rooms.filter((x) => x !== parsedData.room)
      }
      
      if(parsedData.type === "chat"){
        const roomId = Number(parsedData.roomId);
        const message = parsedData.message;
        const roomExists = await prismaClient.room.findUnique({
          where: { id: roomId },
        });
      
        if (!roomExists) {
          console.error(`Room with ID ${roomId} not found`);
          return;
        }
        await prismaClient.chat.create({
          data: {
            userId,
            message,
            roomId
          }
        }); 

        users.forEach((user)=>{
          if(user.rooms.includes(String(roomId))) {
            user.ws.send(JSON.stringify({
              type: "chat",
              message: message,
              roomId 
            }))
          }
        })
      }
  }
  catch(e){
    console.error(e);
  }
  });
});
