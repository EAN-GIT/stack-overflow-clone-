/* eslint-disable no-useless-catch */
"use server";

import { Question } from "@/models/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/models/tag.model";
import {
  GetQuestionByIdParams,
  GetQuestionsParams,
  GetSavedQuestionsParams,
  QuestionVoteParams,
} from "./shared";
import User from "@/models/user.model";
import { revalidatePath } from "next/cache";

// export async function getQuestionbyId(params: GetQuestionByIdParams) {
//   try {
//     connectToDatabase();

//   } catch (error) {
//     throw error;
//   }
// }

export async function getQuestionbyId(params: GetQuestionByIdParams) {
  try {
    connectToDatabase();

    const { questionId } = params;
    // get all questions
    const question = await Question.findById(questionId)
      .populate({ path: "tags", model: Tag, select: "_id name" })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      });

    return question;
  } catch (error) {
    throw error;
  }
}

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

export async function downvoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase();

    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

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
    // await Question.updateOne({ _id: questionId }, updateQuery);
    await Question.findByIdAndUpdate(questionId, updateQuery, { new: true });

    revalidatePath(path);
  } catch (error) {
    throw error;
  }
}

export async function upvoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase();

    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

    let updateQuery = {};

    if (hasupVoted) {
      // If the user has already upvoted, remove their upvote
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasdownVoted) {
      // If the user has downvoted, remove their downvote and add a dupvote
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }

    // Perform the update in the database using the updateQuery
    // await Question.updateOne({ _id: questionId }, updateQuery);
    await Question.findByIdAndUpdate(questionId, updateQuery, { new: true });

    revalidatePath(path);
  } catch (error) {
    throw error;
  }
}