"use client"
import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

 


export function ChatRoomClient({
  messages,
  id
} : {
  messages: {message: string} [];
  id: string 
}) {
  const {socket, loading} = useSocket();
  const [currentMessage, setCurrentMessage] = useState("");
  const [chats,setChats] = useState(messages);

  useEffect(()=>{
    if(socket && !loading) {
      socket.send(JSON.stringify({
        type: "join_room",
        roomId: id
      }))
      socket.onmessage = (e) => {
        const parsedData = JSON.parse(e.data);
        if(parsedData.type === "chat") {
          setChats(c => [...c, parsedData.message])
        }
      }
    }
    
  },[socket, loading, id])
  return <div>
    {chats.map(m=><div>{m.message}</div>)}
    <input type="text" onChange={(e)=>setCurrentMessage(e.target.value)}></input>
    <button onClick={()=>{
      socket?.send(JSON.stringify({
        type: "chat",
        roomId: id,
        message: currentMessage
      }))
      setCurrentMessage(""); 
    }}>Send</button>
  </div>

}