/* eslint-disable no-useless-catch */
"use server";

import User from "@/models/user.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared";
import { revalidatePath } from "next/cache";
import { FilterQuery, Query, model } from "mongoose";
import path from "path";
import { Question } from "@/models/question.model";
import Tag from "@/models/tag.model";

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    connectToDatabase();

    // const {page =1 ,pageSize =20,filter,searchQuery} = params;

    const users = await User.find({});
    // .sort({createdAt:-1})

    return { users };
  } catch (error) {
    return { error: "An unexpected error occurred" };
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

// export async function getSavedQuestions(params: GetSavedQuestionsParams) {
//   try {
//     connectToDatabase();

//     const { clerkId, page = 1, pageSize = 10, filter, searchQuery } = params;

//     const query: FilterQuery<typeof Question> = searchQuery
//       ? { title: { $regex: new RegExp(searchQuery, "i") } }
//       : {};

//     const user = await User.findOne({ clerkId }).populate({
//       path: "saved",
//       match: query,
//       options: {
//         sort: { createdAt: -1 },
//       },
//       populate: [
//         { path: "tags", model: Tag, select: "_id name" },
//         { path: "author", model: User, select: "_id clerkId picture name" },
//       ],
//     });
//     if (!user) {
//       throw new Error("User not found");
//     }

//     const savedQuestions = user.saved;

//     return { questions: savedQuestions };
//   } catch (error) {
//     throw error;
//   }
// }

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    connectToDatabase();

    const { clerkId, page = 1, pageSize = 10, filter, searchQuery } = params;

    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    if (!user) {
      throw new Error("User not found");
    }

    const savedQuestions = user.saved;

    return { questions: savedQuestions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
