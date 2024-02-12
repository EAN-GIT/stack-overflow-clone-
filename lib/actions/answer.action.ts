/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-catch */
"use server";

import Answer from "@/models/answer.model";
import { connectToDatabase } from "../mongoose";
import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from "./shared";
import { Question } from "@/models/question.model";
import { revalidatePath } from "next/cache";
import Interaction from "@/models/interaction.model";
import Tag from "@/models/tag.model";
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

    const { questionId, sortBy, page = 1, pageSize = 10 } = params;

    const skipAmount = (page - 1) * pageSize;

    let sortOptions = {};

    switch (sortBy) {
      case "highestUpvotes":
        sortOptions = { upvotes: -1 };
        break;
      case "lowestUpvotes":
        sortOptions = { upvotes: 1 };
        break;
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;

      default:
        break;
    }

    const answers = await Answer.find({ question: questionId })
      .populate("author", "_id clerkId name picture")
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalAnswer = await Answer.countDocuments({
      question: questionId,
    });

    const isNextAnswer = totalAnswer > skipAmount + answers.length;

    return { answers, isNextAnswer };
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

export async function deleteAnswer(params: DeleteAnswerParams) {
  try {
    connectToDatabase();

    const { answerId, path } = params;

    // Find the answer document in the database using its ID
    const answer = await Answer.findById(answerId);

    // If the answer doesn't exist, throw an error
    if (!answer) {
      throw new Error("Answer not found");
    }

    // Delete the found answer document
    await answer.deleteOne({ id: answerId });

    // Update related Question documents by removing the answerId
    await Question.updateMany(
      { _id: answer.question },
      { $pull: { answer: answerId } },
    );

    // Delete related Interaction documents
    await Interaction.deleteMany({ answer: answerId });

    // Revalidate something (likely a path or cache)
    revalidatePath(path);

    revalidatePath(path);
  } catch (error) {
    throw error;
  }
}
