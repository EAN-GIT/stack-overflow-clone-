"use server"

import User from "@/models/user.model";
import { connectToDatabase } from "../mongoose";




export async function getUserId(params:any){


    try {
        /// connect to Db 
        connectToDatabase()

        // extract id from params
        const {userId} = params;
        // get user 
        const user = await User.findOne({clerkId :userId})

        return user

     } catch (error) {
         console.log(error)
     }

}