export enum SupportedMessages {
  AddChat = "Add_chat",
  UpdateChat = "Update_chat",
}

type MessagePayload = {
  name: string;
  //   userId: string;
  roomId: string;
  chatId: string;
  upvotes: number;
  messaege: string;
};

export type OutgoingMessage =
  | {
      type: SupportedMessages.AddChat;
      payload: Partial<MessagePayload>;
    }
  | {
      type: SupportedMessages.UpdateChat;
      payload: Partial<MessagePayload>;
    };
