import mongoose, { Schema, Document } from "mongoose";

export interface IConversation extends Document {
  participantIds: mongoose.Types.ObjectId[];
  lastMessage: string;
  lastTime: string;
  createdAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    participantIds: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    lastMessage: { type: String, default: "" },
    lastTime: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Conversation = mongoose.model<IConversation>("Conversation", ConversationSchema);