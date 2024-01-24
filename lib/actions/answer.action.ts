/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-catch */
"use server";

import { Answer } from "@/models/answer.model";
import { connectToDatabase } from "../mongoose";
import { CreateAnswerParams, GetAnswersParams } from "./shared";
import { Question } from "@/models/question.model";
import { revalidatePath } from "next/cache";
// import { User } from "lucide-react";

export async function createAnswer(params: CreateAnswerParams) {
  try {
    connectToDatabase();

    const { content, author, question, path } = params;

    // create the answer  new Answer as altanative
    const newAnswer = await Answer.create({ content, author, question });

    // Add the answer to the question"a array
    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    // TODO: Add interaction.....
    // create interaction

    // update user reputaion

    revalidatePath(path);
  } catch (error) {
    throw error;
  }
}

export async function getAllAnswers(params: GetAnswersParams) {
  try {
    connectToDatabase();

    const { questionId } = params;

    const answers = await Answer.find({ question: questionId })
      .populate("author", "_id clerkId name picture")
      .sort({ createdAt: -1 });

    return { answers };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
