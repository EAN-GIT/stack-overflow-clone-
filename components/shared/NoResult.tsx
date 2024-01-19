import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

interface Props {
  title: string;
  link: string;
  description: string;
  linkTitle: string;
}

const NoResult = ({ title, link, description, linkTitle }: Props) => {
  return (
    <div className=" flex flex-col w-full items-center justify-center mt-10">
      {/* Light mode image */}
      <Image
        src="/assets/images/light-illustration.png"
        alt="No Result Image"
        width={270}
        height={200}
        className="block object-contain dark:hidden"
      />

      {/* Dark mode image */}
      <Image
        src="/assets/images/dark-illustration.png"
        alt="No Result Image"
        width={270}
        height={200}
        className="hidden object-contain dark:block"
      />

      {/* Title */}
      <h2 className="h2-bold text-dark200_light900 mt-8">{title}</h2>

      {/* Description */}
      <p className="body-regular text-dark500_light700 my-3.5 max-w-md text-center">
        {description}
      </p>

      {/* Button */}
      <Link href={link}>
        <Button className="paragraph-medium mt-5 min-h-[46px] rounded-lg bg-primary-500 px-4 py-3 text-light-900 hover:bg-primary-500 dark:bg-primary-500 dark:text-light-900">
          {linkTitle}
        </Button>
      </Link>
    </div>
  );
};

export default NoResult;
