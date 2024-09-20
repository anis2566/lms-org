import Image from "next/image";
import Link from "next/link";
import { BookOpen, Clock3 } from "lucide-react";
import { Category, Chapter, Course } from "@prisma/client";

import { Badge } from "@/components/ui/badge";

// import { CourseProgress } from "../course/course-progress";
import { formatPrice } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { IconBadge } from "./icon-badge";

interface CourseWithFeatures extends Course {
  category: Category | null;
  chapters: Chapter[];
  // progress: number | null;
}

interface Props {
  course: CourseWithFeatures;
}

export const CourseCard = ({ course }: Props) => {
  return (
    <Link href={`/dashboard/courses/${course.id}`}>
      <div className="group h-full overflow-hidden rounded-lg border p-3 transition hover:shadow-sm">
        <div className="relative aspect-video w-full overflow-hidden rounded-md">
          <Image
            fill
            className="object-cover"
            alt={course.title}
            src={course.imageUrl || ""}
          />
        </div>
        <div className="flex flex-col pt-2">
          <div className="line-clamp-2 text-lg font-medium transition group-hover:text-sky-700 md:text-base">
            {course.title}
          </div>
          <Badge className="max-w-fit">{course.category?.name}</Badge>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1">
              <IconBadge size="sm" icon={BookOpen} />
              <span>
                {course.chapters?.length}{" "}
                {course.chapters?.length === 1 ? "Chapter" : "Chapters"}
              </span>
            </div>
            <div className="flex items-center gap-x-1">
              <IconBadge size="sm" icon={Clock3} />
              <span>2 hours</span>
            </div>
          </div>
          {/* {course.progress && course.progress !== null ? (
            <CourseProgress
              variant={course.progress === 100 ? "success" : "default"}
              size="sm"
              value={course.progress}
            />
          ) : ( */}
          <p className="text-md font-medium text-slate-700 md:text-sm">
            {formatPrice(course.price ?? 0)}
          </p>
          {/* )} */}
        </div>
      </div>
    </Link>
  );
};

export const CourseCardSkeleton = () => {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="group overflow-hidden rounded-lg border p-3 transition hover:shadow-sm"
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-md">
            <Skeleton className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col gap-y-1 pt-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-1/3 rounded-full" />
            <Skeleton className="h-6 w-1/3 rounded-full" />
            <Skeleton className="h-6 w-1/3 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};
