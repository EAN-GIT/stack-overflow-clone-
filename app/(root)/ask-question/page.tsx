// 'use client'
import QuestionForm from "@/components/forms/QuestionForm";
import { getUserId } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import React from "react";

const Page = async () => {

  const {userId}= auth();
  // const userId = "123456";

  const mongoUser = await getUserId({ userId });

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a Question</h1>
      <div className="mt-9">
        <QuestionForm mongoUserId={JSON.stringify(mongoUser?._id)} />
      </div>
    </div>
  );
};

export default Page;
