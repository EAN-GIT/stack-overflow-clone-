/* eslint-disable no-useless-catch */
"use server";

import User from "@/models/user.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared";
import { revalidatePath } from "next/cache";
import { FilterQuery } from "mongoose";
import Tag from "@/models/tag.model";
import Answer from "@/models/answer.model";
import { Question } from "@/models/question.model";
import { BadgeCriteriaType } from "@/types";
import { assignBadges } from "../utils";

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    connectToDatabase();

    const { searchQuery, filter, page = 1, pageSize = 20 } = params;

    const query: FilterQuery<typeof User> = {};

    const skipAmount = (page - 1) * pageSize;

    let sortOptions = {};

    switch (filter) {
      case "oldest":
        sortOptions = { joinedAt: -1 };
        break;
      case "newest":
        sortOptions = { joinedAt: 1 };
        break;
      case "top_contibutors":
        sortOptions = { reputation: 0 };
        break;
      default:
        break;
    }

    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { username: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    const users = await User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    //  get the total number of users
    const totalUser = await User.countDocuments(query);

    const isNext = totalUser > skipAmount + users.length; // users.length here is the number of user displayed per page
    // skip amount....number of users already skipped

    return { users, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    // connect to Db
    connectToDatabase();

    // create new user//
    const newUser = await User.create(userData);

    return newUser;
  } catch (error) {
    // console.log(error);
    return { error: "An unexpected error occurred" };
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase();

    const { clerkId, updateData, path } = params;
    // update  user data//
    await User.findByIdAndUpdate({ clerkId }, updateData, { new: true });

    // refresh page with  nw data
    revalidatePath(path);
  } catch (error) {
    // console.log(error);
    return { error: "An unexpected error occurred" };
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDatabase();

    const { clerkId } = params;
    // update  user data//
    const user = await User.findByIdAndDelete({ clerkId });

    if (!user) {
      throw new Error("User not found");
    }

    // delete everthing that the user has ever done e.g commets questions,answers etc
    // const userQuestionid = await Question.find({ author: user._id }).distinct(
    //   "_id"
    // );

    // delete user questions
    await Question.deleteMany({ author: user._id });

    // Todo: delete user answers ,comments etc

    // finally delete the user
    const deletedUser = await User.findOneAndDelete(user._id);

    return deletedUser;
  } catch (error) {
    // console.log(error);
    return { error: "An unexpected error occurred" };
  }
}

export async function getUserId(params: any) {
  try {
    // connect to Db
    connectToDatabase();

    // extract id from params
    const { userId } = params;
    // get user
    const user = await User.findOne({ clerkId: userId });

    return user;
  } catch (error) {
    // console.log(error);
    console.log(error);
    throw error;
  }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    connectToDatabase();

    const { userId, questionId, path } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const isQuestionSaved = user.saved.includes(questionId);

    if (isQuestionSaved) {
      // remove question from saved
      await User.findByIdAndUpdate(
        userId,
        { $pull: { saved: questionId } },
        { new: true },
      );
    } else {
      // add question to saved
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { saved: questionId } },
        { new: true },
      );
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    // Establish database connection
    connectToDatabase();

    // Destructure parameters
    const { clerkId, page = 1, pageSize = 20, filter, searchQuery } = params;

    // Calculate the number of documents to skip based on pagination
    const skipAmount = (page - 1) * pageSize;

    // Define query for filtering based on searchQuery
    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    // Define sorting options based on filter
    let sortOptions = {};
    switch (filter) {
      case "most_recent":
        sortOptions = { createdAt: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "most_voted":
        sortOptions = { upvotes: -1 };
        break;
      case "most_viewed":
        sortOptions = { views: -1 };
        break;
      case "most_answered":
        sortOptions = { answers: -1 };
        break;
      default:
        break;
    }

    // Find the user by clerkId and populate their saved questions with tags and author information
    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: {
        sort: sortOptions,
        skip: skipAmount,
        limit: pageSize + 1, // Fetch pageSize + 1 to check if there are more documents
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    // Check if user is found
    if (!user) {
      throw new Error("User not found");
    }

    // Check if there are more documents beyond the pageSize
    const isNext = user.saved.length > pageSize;

    // Retrieve saved questions from the user
    const savedQuestions = user.saved;

    // Return the retrieved questions and flag indicating if there are more questions
    return { questions: savedQuestions, isNext };
  } catch (error) {
    // Log and re-throw any caught errors
    console.log(error);
    throw error;
  }
}
// This function retrieves user information including statistics like total questions, total answers, badge counts, and reputation
export async function getUserInfo(params: GetUserByIdParams) {
  try {
    // Establish database connection
    connectToDatabase();

    // Extract userId from parameters
    const { userId } = params;

    // Find user by userId
    const user = await User.findOne({ clerkId: userId });

    // Throw error if user not found
    if (!user) {
      throw new Error("User not found");
    }

    // Count total questions authored by the user
    const totalQuestions = await Question.countDocuments({ author: user._id });

    // Count total answers authored by the user
    const totalAnswers = await Answer.countDocuments({ author: user._id });

    // Aggregate total upvotes on questions authored by the user
    const [questionUpvotes] = await Question.aggregate([
      { $match: { author: user._id } },
      {
        $project: {
          _id: 0,
          upvotes: { $size: "$upvotes" },
        },
      },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: "$upvotes" },
        },
      },
    ]);

    // Aggregate total upvotes on answers authored by the user
    const [answerUpvotes] = await Answer.aggregate([
      { $match: { author: user._id } },
      {
        $project: {
          _id: 0,
          upvotes: { $size: "$upvotes" },
        },
      },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: "$upvotes" },
        },
      },
    ]);

    // Aggregate total views on questions authored by the user
    const [questionViews] = await Answer.aggregate([
      { $match: { author: user._id } },
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
        },
      },
    ]);

    // Define criteria for badges based on user activity
    const criteria = [
      { type: "QUESTION_COUNT" as BadgeCriteriaType, count: totalQuestions },
      { type: "ANSWER_COUNT" as BadgeCriteriaType, count: totalAnswers },
      {
        type: "QUESTION_UPVOTES" as BadgeCriteriaType,
        count: questionUpvotes?.totalUpvotes || 0,
      },
      {
        type: "ANSWER_UPVOTES" as BadgeCriteriaType,
        count: answerUpvotes?.totalUpvotes || 0,
      },
      {
        type: "TOTAL_VIEWS" as BadgeCriteriaType,
        count: questionViews?.totalViews || 0,
      },
    ];

    // Assign badges based on criteria
    // @ts-ignore
    const badgeCounts = assignBadges({ criteria });

    // Return user information, statistics, and badge counts
    return {
      user,
      totalQuestions,
      totalAnswers,
      badgeCounts,
      reputation: user.reputation,
    };
  } catch (error) {
    // Throw any caught errors
    throw error;
  }
}

export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    connectToDatabase();
    const { userId, page = 1, pageSize = 10 } = params;

    const skipAmount = (page - 1) * pageSize;
    // get total no of questions for this user
    const totalQuestion = await Question.countDocuments({ author: userId });

    // get al questions asked  by a user
    const userQuestions = await Question.find({ author: userId })
      .sort({ createdAt: -1, views: -1, upvotes: -1 })
      .skip(skipAmount)
      .limit(pageSize)
      .populate("tags", "_id name")
      .populate("author", "_id clerkId name picture");

    const isNextQuestions = totalQuestion > skipAmount + userQuestions.length;

    return { totalQuestion, questions: userQuestions, isNextQuestions };
  } catch (error) {
    throw error;
  }
}

export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    connectToDatabase();
    const { userId, page = 1, pageSize = 10 } = params;

    const skipAmount = (page - 1) * pageSize;

    // get total no of Answers for this user
    const totalAnswers = await Answer.countDocuments({ author: userId });

    // get al Answers asked  by a user
    const userAnswers = await Answer.find({ author: userId })
      .sort({ upvotes: -1 })
      .skip(skipAmount)
      .limit(pageSize)
      .populate("question", "_id title")
      .populate("author", "_id clerkId name picture");

    const isNextAnswers = totalAnswers > skipAmount + userAnswers.length;

    return { totalAnswers, answers: userAnswers, isNextAnswers };
  } catch (error) {
    throw error;
  }
}
