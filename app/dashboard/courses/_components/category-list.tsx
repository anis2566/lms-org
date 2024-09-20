"use client";

import Image from "next/image";
import queryString from "query-string";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { cn } from "@/lib/utils";
import { Category } from "@prisma/client";

interface Props {
  categories: Category[];
  isPending: boolean;
}

export const CategoryList = ({ categories, isPending }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = (category: string) => {
    if (searchParams.get("category") === category) {
      router.push(pathname);
    } else {
      const url = queryString.stringifyUrl(
        {
          url: pathname,
          query: {
            category,
          },
        },
        { skipEmptyString: true, skipNull: true },
      );
      router.push(url);
    }
  };

  if (isPending) return <CategorySkeleton />;

  return (
    <div className="flex flex-1 items-center gap-x-3">
      {categories?.map((category) => {
        const active = searchParams.get("category") === category.name;
        return (
          <Badge
            key={category.id}
            className={cn(
              "flex h-10 cursor-pointer items-center gap-x-2 rounded-full border-primary p-2",
            )}
            variant={active ? "default" : "outline"}
            onClick={() => handleClick(category.name)}
          >
            <Image
              src={category.imageUrl}
              alt="Category"
              height={20}
              width={20}
              className="rounded-full"
            />
            {category.name}
          </Badge>
        );
      })}
    </div>
  );
};

const CategorySkeleton = () => {
  return (
    <div className="flex items-center gap-x-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton
          key={index}
          className="flex h-10 w-24 cursor-pointer items-center gap-x-2 rounded-full border-primary p-2"
        />
      ))}
    </div>
  );
};
