import WebSocket from "ws";

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
}
