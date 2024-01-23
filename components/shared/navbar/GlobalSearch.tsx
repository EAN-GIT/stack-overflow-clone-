import Image from "next/image";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const GlobalSearch = () => {
  return (
    <div className="relative w-full max-w-[600px] max-lg:hidden">
      <div className="background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4">
        <Image
          src="/assets/icons/search.svg"
          alt="Search Icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
        <Input
          type="text"
          placeholder="Search anything globally..."
          className="paragraph-regular no-focus placeholder background-light800_darkgradient mx-3 border-none shadow-none outline-none"
          alt="Search Input"
        />
      </div>
    </div>
  );
};

export default GlobalSearch;
