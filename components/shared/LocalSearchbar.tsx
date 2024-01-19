import React from "react";
import { Input } from "../ui/input";
import Image from "next/image";

interface CustomInput {
  route: string;
  iconPosition: string;
  imgSrc: string;
  placeHolder: string;
  otherClasses?: string;
}

const LocalSearchbar = ({
  route,
  iconPosition,
  imgSrc,
  placeHolder,
  otherClasses,
}: CustomInput) => {
  return (
    <>
      <div
        className={`background-light800_darkgradient flex min-h-[56px] grow  items-center gap-4 rounded-[10px] px-4 
           ${otherClasses}
        `}
      >
        {iconPosition === "left" && (
          <Image
            src={imgSrc}
            alt="seacrhIcon"
            width={24}
            height={24}
            className="cursor-pointer"
          />
        )}

        <Input
          placeholder={placeHolder}
          type="text"
          className="text-dark400_light700 paragraph-regular no-focus placeholder text-dark400_light700 border-none bg-transparent shadow-none outline-none"
        />

        {iconPosition === "right" && (
          <Image
            src="/assets/icons/search.svg"
            alt="seacrhIcon"
            width={24}
            height={24}
            className="cursor-pointer"
          />
        )}
      </div>
    </>
  );
};

export default LocalSearchbar;
