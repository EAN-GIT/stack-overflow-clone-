/* eslint-disable no-useless-catch */
"use server";

import { Question } from "@/models/question.model";
import { ViewQuestionParams } from "./shared";
import { connectToDatabase } from "../mongoose";
import Interaction from "@/models/interaction.model";

export async function viewQuestion(params: ViewQuestionParams) {
  try {
    connectToDatabase();

    const { questionId, userId } = params;

    // update view count of the question
    await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } });

    if (userId) {
      const existingInteraction = await Interaction.findOne({
        user: userId,
        action: "view",
        question: questionId,
      });

      if (existingInteraction) return console.log("User has already view this");

      // create interdction
      await Interaction.create({
        user: userId,
        action: "view",
        question: questionId,
      });
    }
  } catch (error) {
    throw error;
  }
}
