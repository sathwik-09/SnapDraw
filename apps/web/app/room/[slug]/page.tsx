import axios from "axios"
import dotenv from "dotenv"
import { ChatRoom } from "../../../components/ChatRoom";
dotenv.config({path: '../../.env'});



async function getRoomId(slug: string) {
  const response = await axios.get(`${process.env.BACKEND_URL}/room/${slug}`);
  return response.data.room.id;
}


export default async function ChatRoom1 ({
  params
}: {
  params: {
    slug : string
  }
}) {
  const slug =  (await params).slug;
  const roomId = await getRoomId(slug);

  return <ChatRoom id={roomId}></ChatRoom>
   
}