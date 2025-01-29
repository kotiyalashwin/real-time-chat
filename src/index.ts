import WebSocket, { WebSocketServer } from "ws";
import { SupportedMessages as OutSupportedMessage } from "./messages/broadcastMessage";
import {
  IncomingMessage,
  InitMessageType,
  SupportedMessages as InSupportedMessage,
} from "./messages/incomingMessages";
import { UserManager } from "./UserManager";
import { InMemoryStore } from "./store/InMemoryStore";
import http from "http";

const server = http.createServer();

const wss = new WebSocketServer({ server });
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
  if (message.type === InSupportedMessage.JoinRoom) {
    const payload = message.payload;
    userManager.addUser(payload.userId, payload.roomId, payload.name, ws);
  }
  if (message.type === InSupportedMessage.SendMessage) {
    const payload = message.payload;

    //check user exists in the room
    const user = userManager.getUser(payload.roomId, payload.userId);
    if (!user) {
      console.error("User not exist in this room");
      return;
    }

    store.addChats(payload.roomId, payload.userId, user?.name, payload.message);
    /// add broadcast logIc
    const outmessage = {
      type: OutSupportedMessage.AddChat,
      payload: {
        name: user.name,
        roomId: payload.roomId,
        upvotes: 0,
        messaege: payload.message,
      },
    };

    userManager.broadcast(payload.roomId, payload.userId, outmessage, ws);
  }
  if (message.type === InSupportedMessage.UpvoteMessage) {
    const payload = message.payload;
    const user = userManager.getUser(payload.roomId, payload.userId);
    if (!user) {
      console.error("User not exist in this room");
      return;
    }
    const chat = store.upvote(payload.roomId, payload.chatId, payload.userId);

    if (!chat) {
      return;
    }
    //upvotes
    const outmessage = {
      type: OutSupportedMessage.UpdateChat,
      payload: {
        upvotes: chat.upvotes.length,
        roomId: payload.roomId,
        chatId: payload.chatId,
      },
    };

    userManager.broadcast(payload.roomId, payload.userId, outmessage, ws);
  }
}

server.listen(8080, () => {
  console.log(`${Date()}: Server Running`);
});
