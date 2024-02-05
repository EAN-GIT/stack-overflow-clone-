// 'use client'
import QuestionForm from "@/components/forms/QuestionForm";
import { getUserId } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import { mongo } from "mongoose";
import { redirect } from "next/navigation";
import React from "react";

const Page = async () => {
  const { userId } = auth();
  // const userId = "123456";

  if (!userId) redirect("/sign-in");

  const mongoUser = await getUserId({ userId });

  console.log(mongoUser);

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a Question</h1>
      <div className="mt-9">
        <QuestionForm mongoUserId={JSON.stringify(mongoUser)} />
      </div>
    </div>
  );
};

export default Page;
