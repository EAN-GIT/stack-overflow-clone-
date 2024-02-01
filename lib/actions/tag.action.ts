"use server";
import User from "@/models/user.model";
import { connectToDatabase } from "../mongoose";
import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared";
import Tag from "@/models/tag.model";

export async function getTopInteractedtags(params: GetTopInteractedTagsParams) {
  try {
    connectToDatabase();

export async function getTopInteractedtags(params: GetTopInteractedTagsParams) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // find interaction fro the user by their questions and answers and group by tag

    return [
      { _id: "1", name: "tag" },
      { _id: "2", name: "tag2" },
    ];
    
  } catch (error) {
    return { error: "An unexpected error occurred" };
  }
}

// get all tags action

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase();

    // const {page =1 ,pageSize =20,filter,searchQuery} = params;

    const tags = await Tag.find({});
    // .sort({createdAt:-1})

    return { tags };
  } catch (error) {
    return { error: "An unexpected error occurred" };
  }
}
