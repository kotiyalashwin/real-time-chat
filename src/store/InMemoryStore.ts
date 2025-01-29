import { Chat, Store, userId } from "./Store";
let globalChatId = 0;

interface Room {
  roomId: string;
  chats: Chat[];
}

export class InMemoryStore implements Store {
  private store: Map<string, Room>;
  //will create map for the room stores
  constructor() {
    this.store = new Map<string, Room>();
  }

  initRoom(roomId: string) {
    this.store.set(roomId, {
      roomId,
      chats: [],
    });
  }

  getChats(limit: number, offset: number, roomId: string) {
    const room = this.store.get(roomId); //

    if (!room) {
      return [];
    }

    return room.chats
      .reverse()
      .slice(0, offset)
      .slice(-1 * limit);
  }

  addChats(roomId: string, userId: userId, name: string, message: string) {
    if (!this.store.get(roomId)) {
      this.initRoom(roomId);
    }
    const room = this.store.get(roomId);
    if (!room) {
      return;
    }

    room.chats.push({
      id: (globalChatId++).toString(),
      userId,
      name,
      message,
      upvotes: [],
    });
  }

  upvote(roomId: string, chatId: string, userId: string) {
    const room = this.store.get(roomId);
    if (!room) {
      return;
    }

    const chat = room.chats.find(({ id }) => id === chatId);

    if (chat) {
      chat.upvotes.push(userId);
    }

    return chat;
  }
}
