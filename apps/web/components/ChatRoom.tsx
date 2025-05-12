import axios from "axios"
import { ChatRoomClient } from "./ChatRoomClient";
import { BACKEND_URL } from "../app/room/config";



async function getChats(roomId: string) {
  const response = await axios.get(`${BACKEND_URL}/chats/${roomId}`);
  return response.data.messages;

}

export async function ChatRoom({id}: {
  id: string
}) {
  const messages = await getChats(id);
  return <ChatRoomClient id={id} messages={messages} />
}