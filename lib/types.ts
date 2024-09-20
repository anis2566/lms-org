import { Prisma } from "@prisma/client";

export function getCourseDataInclude() {
  return {
    chapters: true,
    category: true,
  } satisfies Prisma.CourseInclude;
}

export type CourseData = Prisma.CourseGetPayload<{
  include: ReturnType<typeof getCourseDataInclude>;
}>;

export interface CoursePage {
  courses: CourseData[];
  nextCursor: string | null;
}
