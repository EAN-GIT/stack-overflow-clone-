
import * as z from "zod"


// define the form schema 
 export const QuestionsSchema = z.object({
    title: z.string().min(5, {
      message: "Username must be at least 2 characters.",
    }).max(130),
    explanation:z.string().min(10),
    tags:z.array(z.string().min(1).max(15)).min(1).max(3)


  })
  