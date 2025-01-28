export type userId = string;

export interface Chat {
  id: string;
  userId: userId;
  name: string;
  message: string;
  upvotes: userId[]; // who has upvoted what
}

export abstract class Store {
  constructor() {}

  initRoom(roomId: string) {}

  getChats(limit: number, offset: number, room: string) {}

  addChats(userId: userId, message: string, roomId: string, name: string) {}
}
