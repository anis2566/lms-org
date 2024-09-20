"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { CategoryList } from "./category-list";
import { Search } from "./search";
import { SearchFilter } from "./search-filter";
import kyInstance from "@/lib/ky";
import InfiniteScrollContainer from "@/components/infinite-scroll-container";
import { Loader2 } from "lucide-react";
import { CoursePage } from "@/lib/types";
import { CourseCard, CourseCardSkeleton } from "@/components/course-card";
import { GET_CATEGORIES } from "../action";

export const CourseList = () => {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const params = Object.fromEntries(searchParams.entries());

  const { data: categories, isPending } = useQuery({
    queryKey: ["category-for-browse"],
    queryFn: async () => {
      const res = await GET_CATEGORIES();
      return res.categories;
    },
    staleTime: 60 * 60 * 1000,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["get-course-for-browse", category, params],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get("/api/course", {
          searchParams: {
            ...params,
            ...(pageParam && { cursor: pageParam }),
          },
        })
        .json<CoursePage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const courses = data?.pages.flatMap((page) => page.courses) || [];

  if (status === "pending") {
    return <CourseCardSkeleton />;
  }

  if (status === "success" && !courses.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        No posts found. Start following people to see their posts here.
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading posts.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <CategoryList categories={categories || []} isPending={isPending} />
      <SearchFilter />
      <div className="flex items-center justify-between"></div>
      <InfiniteScrollContainer
        className="grid gap-3 md:grid-cols-3"
        onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
      >
        {courses.map((course, i) => (
          <CourseCard key={i} course={course} />
        ))}
        {isFetchingNextPage && (
          <div className="flex justify-center">
            <Loader2 className="mx-auto my-3 animate-spin" />
          </div>
        )}
      </InfiniteScrollContainer>
    </div>
  );
};
