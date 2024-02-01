/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-catch */
"use server";

import Answer from "@/models/answer.model";
import { connectToDatabase } from "../mongoose";
import {
  AnswerVoteParams,
  CreateAnswerParams,
  GetAnswersParams,
} from "./shared";
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

export async function upvoteAnswer(params: AnswerVoteParams) {
  try {
    connectToDatabase();

    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;

    let updateQuery = {};

    if (hasupVoted) {
      // If the user has already upvoted, remove their upvote
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasdownVoted) {
      // If the user has downvoted, remove their downvote and add an upvote
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      // If the user has not voted before, add their upvote
      updateQuery = { $addToSet: { upvotes: userId } };
    }

    // Perform the update in the database using the updateQuery
    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });
    // Trigger a revalidation for the specified path (used in caching strategies)
    revalidatePath(path);
  } catch (error) {
    throw error;
  }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
  try {
    connectToDatabase();

    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;

    let updateQuery = {};

    if (hasdownVoted) {
      // If the user has already downvoted, remove their downvote
      updateQuery = { $pull: { downvotes: userId } };
    } else if (hasupVoted) {
      // If the user has upvoted, remove their upvote and add a downvote
      updateQuery = {
        $push: { downvotes: userId },
        $pull: { upvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { downvotes: userId } };
    }

    // Perform the update in the database using the updateQuery
    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    revalidatePath(path);
  } catch (error) {
    throw error;
  }
}
