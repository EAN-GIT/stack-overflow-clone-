import { Schema, model, models, Document } from "mongoose";

interface IAnswer extends Document {
  content: string;
  author: Schema.Types.ObjectId; // reference to the user who owns the todo
  createdAt: Date;
  question: Schema.Types.ObjectId;
  upvotes: Schema.Types.ObjectId[];
  downvotes: Schema.Types.ObjectId[];
}

const answerSchema = new Schema<IAnswer>({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "Author",
    required: true,
  },
  question: {
    type: Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  createdAt: { type: Date, default: Date.now() },
  upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

export const Answer = models.Answer || model<IAnswer>("Answer", answerSchema);
