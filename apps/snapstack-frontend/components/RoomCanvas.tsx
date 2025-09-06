"use client"

import { useEffect, useState } from "react";

import { WS_URL } from "@/config";
import { Canvas } from "./Canvas";


export function RoomCanvas({roomId}: {roomId: string}) {
  
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(()=> {
    const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjMTY2YTI0MC1iZDFjLTQ5NTgtYjZiMi01ZWIzMDMzOTM1NzAiLCJpYXQiOjE3NDQxMzAzMzR9.vAP_4HB70-LDFMYo1bGEeGyD8N4UdnyrM4yZqOGLsgY`);
      ws.onopen = () => {
        setSocket(ws);
        const data = JSON.stringify({
          type: "join_room",
          roomId
        })
        ws.send(data);
      }
  },[])
  
  if(!socket) {
    return<div>
      Connecting to server.......
    </div>
  }

  return <div>
    <Canvas roomId = {roomId} socket= {socket} />
  </div>

  
}