import Link from "next/link";
import React from "react";
import { Badge } from "@/components/ui/badge";

interface Props {
  key: string;
  _id: string;
  name: string;
  totalCount?: string;
  showCount?: boolean;
}

const RenderTag = ({ _id, name, totalCount, showCount }: Props) => {
  return (
    <Link href={`./tags/${_id}`} className="flex justify-between gap-2">
      <Badge className="bg-light-800 dark:bg-dark-400 text-light400_light500 subtle-medium rounded-md border-none px-4 py-2 uppercase">
        {name}
      </Badge>

      {showCount && (
        <p className="small-medium text-dark500_light700">{totalCount}</p>
      )}
    </Link>
  );
};

export default RenderTag;
