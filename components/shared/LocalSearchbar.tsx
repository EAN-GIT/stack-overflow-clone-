"use client";
import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import Image from "next/image";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("q");

  const [search, setSearch] = useState(query || "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "q",
          value: search,
        });

        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ["q"],
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search, route, pathname, router, query, searchParams]);

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
            alt="Search Icon"
            width={24}
            height={24}
            className="cursor-pointer"
          />
        )}

        <Input
          placeholder={placeHolder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          className="text-dark400_light700 paragraph-regular no-focus placeholder text-dark400_light700 border-none bg-transparent shadow-none outline-none"
        />

        {iconPosition === "right" && (
          <Image
            src="/assets/icons/search.svg"
            alt="Search Icon"
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
