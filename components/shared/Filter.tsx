"use client";
import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { SelectGroup } from "@radix-ui/react-select";

interface Props {
  filters: { name: string; value: string }[];
  otherClasses?: string;
  containerClasses?: string;
  placeholder?: string;
}

const Filter = ({
  filters,
  otherClasses,
  containerClasses,
  placeholder,
}: Props) => {
  return (
    <div className={`relative ${containerClasses}`}>
      <Select>
        <SelectTrigger
          className={`${otherClasses} body-regular light-border 
      background-light800_dark300 text-dark500_light700 px-5 py-2.5`}
        >
          <div className="line-clamp-1 flex-1 text-left focus:border-none focus:outline-none">
            <SelectValue placeholder="Select a Filter" />
          </div>
        </SelectTrigger>
        <SelectContent className="text-dark500_light700 small-regular border-none bg-light-900 dark:bg-[#020617]">
          <SelectGroup>
            {filters.map((filter) => {
              return (
                <SelectItem
                  key={filter.value}
                  value={filter.value}
                  className="cursor-pointer focus:bg-light-800 dark:focus:bg-dark-400"
                >
                  {filter.name}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filter;
