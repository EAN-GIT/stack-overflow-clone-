import LocalSearchbar from "@/components/shared/LocalSearchbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import Filter from "../../../components/shared/Filter";
import { HomePageFilters } from "@/constants/filters";
import HomeFilters from "@/components/HomeFilters";
import NoResult from "@/components/shared/NoResult";
import QuestionsCard from "@/components/cards/QuestionsCard";

// dummy data
const questionData = [
  {
    _id: "1",
    title: "How to clone a repo",
    tags: [
      { _id: "1", name: "React" },
      { _id: "3", name: "Vue" },
    ],
    author: {
      _id: "author1",
      name: "Mary Joe",
      picture: "/assets/icons/avatar.svg",
    },
    upvotes: ["user1", "user2"],
    views: 100,
    answers: [],
    createdAt: new Date("2022-01-01"),
  },
  {
    _id: "2",
    title: "How to create a pull request",
    tags: [
      { _id: "1", name: "React" },
      { _id: "3", name: "Html" },
    ],
    author: {
      _id: "author1",
      name: "Mary Joe",
      picture: "/assets/icons/avatar.svg",
    },
    upvotes: ["user1", "user3"],
    views: 100,
    answers: [],
    createdAt: new Date("2022-02-15"),
  },
  {
    _id:' 3',
    title: "How find a Bug in my code",
    tags: [
      { _id: '1', name: "Sql" },
      { _id: '3', name: "Kotlin" },
    ],
    author: {
      _id: "author1",
      name: "Mary Joe",
      picture: "/assets/icons/avatar.svg",
    },
    upvotes: ["user1", "user4"],
    views: 100,
    answers: [],
    createdAt: new Date("2022-03-20"),
  },
];

const Home = () => {
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
        {questionData.length > 0 ? (
          // Loop over the questions array and render the QuestionCard component

          questionData.map((question) => (
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
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
          discussion. our query could be the next big thing others learn from. Get
          involved! 💡"
            title="There’s no question to show"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
};

export default Home;
