import LocalSearchbar from "@/components/shared/LocalSearchbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import Filter from "../../../components/shared/Filter";
import { HomePageFilters } from "@/constants/filters";
import HomeFilters from "@/components/HomeFilters";
import NoResult from "@/components/shared/NoResult";
import QuestionsCard from "@/components/forms/QuestionsCard";
import { getQuestions } from "@/lib/actions/question.action";



const Home = async () => {
  // call the get all question server action
  const result = await getQuestions({});


  return (
    <>
      <div className="flex w-full  flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center  ">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Link href="/ask-question" className="flex justify-end max-sm:w-full ">
          <Button className="primary-gradient !text-light-900 min-h-[46px] px-4 py-3">
            Ask a Question
          </Button>
        </Link>
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route={"/"}
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeHolder="Search for questions"
          otherClasses="flex-1"
        />

        {/* display the shadcn select comp when in mobile view else display the filter cards */}

        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>

      {/* filter Tags below search  */}
      <HomeFilters />

      {/* queston tag  goes here */}
      <div className="flex mt-10 w-full flex-col gap-6">
        {result.questions.length > 0 ? (
          // Loop over the questions array and render the QuestionCard component
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
            title="There’s no question to show"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
};

export default Home;

