import LocalSearchbar from "@/components/shared/LocalSearchbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import Filter from "../../../components/shared/Filter";
import { HomePageFilters } from "@/constants/filters";
import HomeFilters from "@/components/HomeFilters";


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
            containerClasses="hidden max-md:flex"/>
       
      </div>

      {/* filter Tags below search  */}
      <HomeFilters/>
      
    </>
  );
};

export default Home;
