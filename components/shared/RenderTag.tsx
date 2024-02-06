import Link from "next/link";
import React from "react";
import { Badge } from "@/components/ui/badge";

interface Props {
  key: string;
  _id: string;
  name: string;
  totalQuestions?: string;
  showCount?: boolean;
}

const RenderTag = ({ _id, name, totalQuestions, showCount }: Props) => {
  return (
    <Link href={`./tags/${_id}`} className="flex justify-between gap-2">
      <Badge className="text-light400_light500 subtle-medium rounded-md border-none bg-light-800 px-4 py-2 uppercase dark:bg-dark-400">
        {name}
      </Badge>

      {showCount && (
        <p className="small-medium text-dark500_light700">{totalQuestions}</p>
      )}
    </Link>
  );
};

export default RenderTag;
