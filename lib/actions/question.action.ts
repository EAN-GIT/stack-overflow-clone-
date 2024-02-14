/* eslint-disable no-useless-catch */
"use server";

import { Question } from "@/models/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/models/tag.model";
import {
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
} from "./shared";
import User from "@/models/user.model";
import { revalidatePath } from "next/cache";
import Answer from "@/models/answer.model";
import Interaction from "@/models/interaction.model";
import { FilterQuery } from "mongoose";

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
  try {
    connectToDatabase();

    const { searchQuery, filter, page = 1, pageSize = 2 } = params;

    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }
    // amount to skip....to calculate the number of posts(items) to skip based on the page size and number
    const skipAmount = (page - 1) * pageSize;

    let sortOptions = {};

    switch (filter) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "frequent":
        sortOptions = { views: -1 };
        break;
      case "unanswered":
        query.answers = { $size: 0 };
        break;
      default:
        break;
    }

    const questions = await Question.find(query)
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);

    //  to know the total number of questions we have
    const totalQuestions = await Question.countDocuments(query);
    // so that we can determine if a next page exist to use to make the next button abled
    const isNext = totalQuestions > skipAmount + questions.length; // question.length here i sthe n0 of question for the current page
    //  skip amount ..no of question we've alrready skipped

    return { questions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
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

    // create  an interarction record for the user's ask question action
    await Interaction.create({
      user: author,
      action: "ask_question",
      question: question._id,
      tags: tagDocument,
    });

    //  increment author's reputaion by +5 for creating a question
    await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } });

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
    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    // Increment author's reputation
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasdownVoted ? -2 : 2 },
    });

    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasdownVoted ? -10 : 10 },
    });

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
    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    // Increment author's reputation by +1/-1 for upvoting/revoking an upvote to the question
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasupVoted ? -1 : 1 },
    });

    // Increment author's reputation by +10/-10 for recieving an upvote/downvote to the question
    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasupVoted ? -10 : 10 },
    });

    revalidatePath(path);
  } catch (error) {
    throw error;
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    connectToDatabase();

    const { questionId, path } = params;
    // find question by id and delete

    // Delete the Question document directly by its ID
    await Question.deleteOne({ id: questionId });

    // Delete all related Answer documents based on the questionId
    await Answer.deleteMany({ question: questionId });

    // Delete related Interaction documents based on the questionId
    await Interaction.deleteMany({ question: questionId });

    // Update related Tag documents by removing the questionId
    await Tag.updateMany(
      { question: questionId },
      { $pull: { question: questionId } },
    );
    revalidatePath(path);
  } catch (error) {
    throw error;
  }
}

export async function editQuestion(params: EditQuestionParams) {
  try {
    connectToDatabase();

    const { questionId, path, content, title } = params;

    const editedQuestion = await Question.findByIdAndUpdate(
      questionId,
      { content, title },
      { new: true },
    );
    if (!editedQuestion) {
      throw new Error("Question not found");
    }

    revalidatePath(path);

    return editedQuestion;
  } catch (error) {
    throw error;
  }
}

// export async function getHotQuestions() {
//   try {
//     connectToDatabase();

//     const hotQuestions = await Question.find({})
//       .sort({ views: -1, upvotes: -1 })
//       .limit(5);

//     return hotQuestions;
//   } catch (error) {
//     throw error;
//   }
// }

export async function getHotQuestions() {
  try {
    connectToDatabase();

    const hotQuestions = await Question.find({})
      .sort({ views: -1, upvotes: -1 })
      .limit(5);

    return hotQuestions;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
