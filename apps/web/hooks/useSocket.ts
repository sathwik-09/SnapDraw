import { useEffect, useState } from "react";
import { WS_URL } from "../app/room/config";


export function useSocket () {
  const [loading, setLoading] = useState(true);
  const [socket,setSocket] = useState<WebSocket>();
  useEffect(()=>{
    const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhMzYzZGQ0YS0xOThiLTQ5ODctOWMzOC02NTI0OWNhZTc4MjQiLCJpYXQiOjE3NDQwOTA0NjB9.VDj43_JuWeH7uNU40a8XK22oiEl4cUVVIFkfgVnMqxY`);
    ws.onopen = () =>{
      setLoading(false);
      setSocket(ws);
    }
  },[]);

  return {
    socket,
    loading
  }
}