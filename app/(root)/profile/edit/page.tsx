import ProfileForm from "@/components/forms/ProfileForm";
import { ParamsProps } from "@/types";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
import { getUserId } from "@/lib/actions/user.action";

const Page = async ({ params }: ParamsProps) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await getUserId({ userId });

  console.log(user);

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>

      <div className="mt-9">
        <ProfileForm user={JSON.stringify(user)} clerkId={userId} />
      </div>
    </>
  );
};

export default Page;
