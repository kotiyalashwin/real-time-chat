import WebSocket, { WebSocketServer } from "ws";
import {
  IncomingMessage,
  InitMessageType,
  SupportedMessages,
} from "./messages/incomingMessages";
import { UserManager } from "./UserManager";
import { InMemoryStore } from "./store/InMemoryStore";

const wss = new WebSocketServer({ port: 8080 });
const userManager = new UserManager();
const store = new InMemoryStore();

wss.on("connection", function connection(ws) {
  //add rate limiting
  ws.on("error", console.error);

  ws.on("message", function message(data, isbinary) {
    try {
      messageHandler(ws, JSON.parse(data.toString()));
    } catch {}
  });

  //   console.log(wss.clients);
  ws.send("Connected to the websocket");
});

function messageHandler(ws: WebSocket, message: IncomingMessage) {
  if (message.type === SupportedMessages.JoinRoom) {
    const payload = message.payload;
    userManager.addUser(payload.userId, payload.roomId, payload.name, ws);
  }
  if (message.type === SupportedMessages.SendMessage) {
    const payload = message.payload;

    //check user exists in the room
    const user = userManager.getUser(payload.roomId, payload.userId);
    if (!user) {
      console.error("User not exist in this room");
      return;
    }

    store.addChats(payload.roomId, payload.userId, user?.name, payload.message);
    /// add broadcast logIc
  }
  if (message.type === SupportedMessages.UpvoteMessage) {
    const payload = message.payload;
    const user = userManager.getUser(payload.roomId, payload.userId);
    if (!user) {
      console.error("User not exist in this room");
      return;
    }
    store.upvote(payload.roomId, payload.chatId, payload.userId);
  }
}
