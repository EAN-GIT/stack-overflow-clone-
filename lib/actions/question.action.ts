"use server";

import { Question } from "@/models/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/models/tag.model";
import { GetQuestionsParams } from "./shared";
import User from "@/models/user.model";
import { revalidatePath } from "next/cache";

export async function getQuestions(params: GetQuestionsParams) {
  connectToDatabase();

  // get all questions
  const questions = await Question.find({})
    .populate({ path: "tags", model: Tag })
    .populate({ path: "author", model: User })
    .sort({ createdAt: -1 });

  return { questions };
}

// handke creating questions
export async function createQuestion(params: any) {
  try {
    /// connect to Db
    connectToDatabase();

    const { title, author, content, tags, path } = params;

    // create new Question
    const question = await Question.create({
      title,
      author,
      content,
    });

    const tagDocument = [];

    // create the tags or get them i fthey already exist
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        // regular expression search
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true },
      );

      tagDocument.push(existingTag._id);
    }
    // makes the relation btw tag   question
    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocument } },
    });

    // retuen to home page after crdating question
    revalidatePath(path);
  } catch (error) {
    return { error: "An unexpected error occurred" };
  }
}
