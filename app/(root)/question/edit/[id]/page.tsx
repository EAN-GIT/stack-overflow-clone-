// 'use client'
import QuestionForm from "@/components/forms/QuestionForm";
import { getQuestionbyId } from "@/lib/actions/question.action";
import { getUserId } from "@/lib/actions/user.action";
import { ParamsProps } from "@/types";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

const Page = async ({ params }: ParamsProps) => {
  const { userId } = auth();

  console.log({ userrrrrrrrrrrrr: userId });

  if (!userId) {
    redirect("/sign-in");
    return null;
  }

  const questionDetails = await getQuestionbyId({ questionId: params.id });
  const mongoUser = await getUserId({ userId });

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>
      <div className="mt-9">
        <QuestionForm
          mongoUserId={JSON.stringify(mongoUser._id)}
          questionDetails={JSON.stringify(questionDetails)}
          type="Edit"
        />
      </div>
    </div>
  );
};

export default Page;
