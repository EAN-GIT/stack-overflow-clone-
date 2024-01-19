import mongoose from "mongoose";

// import dotenv from 'dotenv';
// dotenv.config();

let isConnected = false;

export async function connectToDatabase() {
  mongoose.set("strictQuery", true);

  if (!process.env.DATABASE_URL) {
    // throw error
    // console.log("Misssing url")
  }

  if (isConnected) {
    // console.log('Mongo_db is already connected')
    return;
  }
  try {
    // const databaseUrl = process.env.DATABASE_URL as string; // Assert that it's a string
    // Connect here
    await mongoose.connect(process.env.DATABASE_URL!, {
      dbName: "DevFlow",
    });
    isConnected = true; // Set isConnected to true upon successful connection
    // console.log('Mongo_db connected successfully');
  } catch (error) {
    console.error("Mongo_db connection error:", error);
  }
}
