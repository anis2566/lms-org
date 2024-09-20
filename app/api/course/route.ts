import { db } from "@/lib/prisma";
import { CoursePage, getCourseDataInclude } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const category = req.nextUrl.searchParams.get("category") || null;

    const pageSize = 6;

    const posts = await db.course.findMany({
      where: {
        ...(category && {
          category: {
            name: category,
          },
        }),
      },
      include: getCourseDataInclude(),
      orderBy: { createdAt: "asc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;

    const data: CoursePage = {
      courses: posts.slice(0, pageSize),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
