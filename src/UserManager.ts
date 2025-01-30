import WebSocket from "ws";
import {
  OutgoingMessage,
  SupportedMessages,
} from "./messages/broadcastMessage";

type User = {
  id: string;
  name: string;
  ws: WebSocket;
};

interface Room {
  users: User[];
}

export class UserManager {
  private room: Map<string, Room>;

  constructor() {
    this.room = new Map<string, Room>();
  }

  addUser(userId: string, roomId: string, name: string, socket: WebSocket) {
    //check if there exist a mapping for this room
    if (!this.room.get(roomId)) {
      //if not then initialise a mapping for this particular roomId
      this.room.set(roomId, { users: [] });
    }
    //add the user to the room id mapping
    this.room.get(roomId)?.users.push({ id: userId, name, ws: socket });
  }

  removeUser(roomId: string, userId: string) {
    const room = this.room.get(roomId);

    if (!room) {
      return;
    }
    room.users = room.users.filter(({ id }) => id !== userId);
  }

  getUser(roomId: string, userId: string): User | null {
    const user = this.room.get(roomId)?.users.find(({ id }) => id === userId);
    return user ?? null;
  }

  broadcast(roomId: string, userId: string, message: OutgoingMessage) {
    const user = this.getUser(roomId, userId);
    // console.log(`Send from ${user?.id}`);
    if (!user) {
      console.error("User not found");
      return;
    }
    const room = this.room.get(roomId);
    // console.log(room?.users);
    if (!room) {
      console.error("Room Does not exist");
      return;
    }
    const users = room.users.filter(({ id }) => id !== userId);
    // console.log(users);
    // console.log("Sending To" + users);
    console.log(message);
    users.forEach(({ ws }) => {
      ws.send(JSON.stringify(message));
    });
  }
}
