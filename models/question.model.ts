// import { User } from "lucide-react";
import  { models, Schema,Document, model } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
interface IQuestion extends Document {
  title: string;
  content: string;
  tags: Schema.Types.ObjectId[];
  author: Schema.Types.ObjectId; //reference to the user who owns the todo
  createdDate: Date;
  answers:Schema.Types.ObjectId[] ;
  upvotes: Schema.Types.ObjectId[];
  downvotes: Schema.Types.ObjectId[];
  views: number;
}

// 2. Create a Schema corresponding to the document interface.
const questionSchema = new Schema<IQuestion>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag", required: true }],
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdDate:{type:Date,default:Date.now()},
  views:{type:Number,default:0},
  answers:[{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  upvotes: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  downvotes: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
});

export const Question = models.Question || model<IQuestion>("Question", questionSchema);
