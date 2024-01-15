"use server"

import { connectToDatabase } from "../mongoose"

export async function  createQuestion(params:any) {
    
    try {
       /// connect to Db 
       connectToDatabase()
    } catch (error) {
        
    }
}