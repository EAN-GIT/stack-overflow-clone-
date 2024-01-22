
'use client'
import User from "@/models/user.model";
import { connectToDatabase } from "../mongoose";
import { GetTopInteractedTagsParams } from "./shared";



export async function getTopInteractedtags(params:GetTopInteractedTagsParams){

    try {
      connectToDatabase();
  

    const {userId}= params;
  
      const user =  await User.findById({userId});

      if(!user){throw new Error("User not found")}

      // find interaction fro the user by their questions and answers and group by tag
  
      return [ {_id: '1', name: 'tag'}, {_id: '2', name: 'tag2'}]

  }
    catch (error) {
       return { error: 'An unexpected error occurred' };
    }
  }