"use server";

import User from "@/models/user.model";
import { connectToDatabase } from "../mongoose";
import { CreateUserParams, DeleteUserParams, UpdateUserParams } from "./shared";
import { revalidatePath } from "next/cache";
import { Question } from "@/models/question.model";

export async function createUser(userData: CreateUserParams) {
  try {
    // connect to Db
    connectToDatabase();

    // create new user//
    const newUser = await User.create(userData);

    return newUser;
  } catch (error) {
    // console.log(error);
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
  }
}
