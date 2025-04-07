import {WebSocketServer, WebSocket} from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({path: '../../.env'});

const wss = new WebSocketServer({port: 8080});

interface User {
  ws: WebSocket,
  rooms: string[],
  userId: string
}

const users: User[] = [];


function checkUser(token: string): string | null {
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  if(typeof decoded === 'string') {
    return null;
  }

  if(!decoded || !decoded.userId) {
    return null;
  }
  return decoded.userId;
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
  
  ws.on('message', function message(data) {
    const parsedData = JSON.parse(data as unknown as string);
    if(parsedData.type === "join_room") {
      const user = users.find(x => x.ws === ws);
      user?.rooms.push(parsedData.roomId);
    }

    if(parsedData.type === "leave_room") {
      const user = users.find(x => x.ws === ws);
      if(!user) {
        return;
      } 
      user.rooms = user?.rooms.filter(x => x === parsedData.room)
    }

    if(parsedData.type === "chat"){
      
    }
  });

  
});
