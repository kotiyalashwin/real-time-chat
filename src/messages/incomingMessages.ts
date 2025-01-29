import z from "zod";

export enum SupportedMessages {
  JoinRoom = "Join_Room",
  SendMessage = "Send_Message",
  UpvoteMessage = "Upvote_Message",
}

export type IncomingMessage =
  | {
      type: SupportedMessages.JoinRoom;
      payload: InitMessageType;
    }
  | {
      type: SupportedMessages.SendMessage;
      payload: UserMessageType;
    }
  | {
      type: SupportedMessages.UpvoteMessage;
      payload: UpVoteType;
    };

export const InitMessage = z.object({
  name: z.string(),
  userId: z.string(),
  roomId: z.string(),
});

export const UserMessage = z.object({
  message: z.string(),
  userId: z.string(),
  roomId: z.string(),
});

export const UpVote = z.object({
  userId: z.string(),
  roomId: z.string(),
  chatId: z.string(),
});

export type UserMessageType = z.infer<typeof UserMessage>;
export type InitMessageType = z.infer<typeof InitMessage>;
export type UpVoteType = z.infer<typeof UpVote>;
