import LocalSearchbar from "@/components/shared/LocalSearchbar";
import React from "react";
import Filter from "../../../components/shared/Filter";
import { QuestionFilters } from "@/constants/filters";
import NoResult from "@/components/shared/NoResult";
import QuestionsCard from "@/components/cards/QuestionsCard";
import { auth } from "@clerk/nextjs";
import { getSavedQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";

const Home = async ({ searchParams }: SearchParamsProps) => {
  const { userId } = auth();

  // call the get all saved question server action
  if (!userId) return null;
  const result = await getSavedQuestions({
    clerkId: userId,

    searchQuery: searchParams.q,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route={"/collection"}
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeHolder="Search for saved questions collection"
          otherClasses="flex-1"
        />

        {/* display the shadcn select comp when in mobile view else display the filter cards */}

        <Filter
          filters={QuestionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {result.questions.length > 0 ? (
          // Loop over the saved questions array and render the QuestionCard component
          result.questions.map((question) => (
            <QuestionsCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            link="/"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. Your query could be the next big thing others learn from. Get involved! 💡"
            title="There’s saved questions to show"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
};

export default Home;
