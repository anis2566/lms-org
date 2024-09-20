"use server";

import { db } from "@/lib/prisma";
import { Chapter } from "@prisma/client";
import { revalidatePath } from "next/cache";
import axios from "axios";
import { AttachmentSchema, AttachmentSchemaType } from "./schema";

type UpdateChapter = {
  id: string;
  courseId: string;
  values: Chapter;
};

export const UPDATE_CHAPTER = async ({
  id,
  values,
  courseId,
}: UpdateChapter) => {
  const chapter = await db.chapter.findUnique({
    where: {
      id,
      courseId,
    },
  });

  if (!chapter) {
    throw new Error("Chapter not found");
  }

  const { id: chapterId, ...rest } = values;

  await db.chapter.update({
    where: {
      id,
      courseId,
    },
    data: {
      ...rest,
    },
  });

  revalidatePath(`/admin/course/${courseId}/chapter/${id}`);

  return {
    success: "Chapter updated",
  };
};

export const CREATE_ATTACHMENT = async (values: AttachmentSchemaType) => {
  const { data, success } = AttachmentSchema.safeParse(values);

  if (!success) {
    throw new Error("Invalid input value");
  }

  const chapter = await db.chapter.findUnique({
    where: {
      id: data.chapterId,
    },
  });

  if (!chapter) throw new Error("Chapter not found");

  await db.attachment.create({
    data: {
      ...data,
    },
  });

  revalidatePath(`/admin/course/${chapter.courseId}/chapter/${data.chapterId}`);

  return {
    success: "Attachment created",
  };
};

export const DELETE_ATTACHMENT = async (id: string) => {
  const attachment = await db.attachment.findUnique({
    where: {
      id,
    },
    include: {
      chapter: true,
    },
  });

  if (!attachment) {
    throw new Error("Attachment not found");
  }

  await db.attachment.delete({
    where: {
      id,
    },
  });

  revalidatePath(
    `/admin/course/${attachment.chapter.courseId}/chapter/${attachment.chapterId}`,
  );

  return {
    success: "Attachment deleted",
  };
};

export const GET_CREDENTIALS = async (title: string) => {
  const res = await fetch(
    `https://dev.vdocipher.com/api/videos?title=${title}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Apisecret ${process.env.VIDEO_CIPHER_API_KEY}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error(`Fail to obtain credentials`);
  }

  const data = await res.json();

  return {
    payload: data?.clientPayload,
    videoId: data?.videoId,
  };
};

export const UPLOAD_VIDEO = async (formData: FormData) => {
  const uploadLink = formData.get("uploadLink") as string;
  const videoId = formData.get("videoId") as string;
  const chapterId = formData.get("chapterId") as string;
  const courseId = formData.get("courseId") as string;

  formData.delete("uploadLink");
  formData.delete("videoId");
  formData.delete("chapterId");
  formData.delete("courseId");

  try {
    await axios.post(uploadLink, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    await db.chapter.update({
      where: {
        id: chapterId,
      },
      data: {
        videoUrl: videoId,
      },
    });

    revalidatePath(`/admin/course/${courseId}/chapters/${chapterId}`);

    return {
      success: "Video uploded",
    };
  } catch (error) {
    throw new Error("Faild to upload video");
  }
};

export const PUBLISH_CHAPTER = async (id: string) => {
  const chapter = await db.chapter.findUnique({
    where: {
      id,
    },
  });

  if (!chapter) {
    throw new Error("Chapter not found");
  }

  await db.chapter.update({
    where: {
      id,
    },
    data: {
      isPublished: true,
    },
  });

  revalidatePath(`/admin/course/${chapter.courseId}/chapter/${id}`);

  return {
    success: "Chapter published",
  };
};

export const UNPUBLISH_CHAPTER = async (id: string) => {
  const chapter = await db.chapter.findUnique({
    where: {
      id,
    },
  });

  if (!chapter) {
    throw new Error("Chapter not found");
  }

  await db.chapter.update({
    where: {
      id,
    },
    data: {
      isPublished: false,
    },
  });

  revalidatePath(`/admin/course/${chapter.courseId}/chapter/${id}`);

  return {
    success: "Chapter published",
  };
};

export const DELETE_CHAPTER = async (id: string) => {
  const chapter = await db.chapter.findUnique({
    where: {
      id,
    },
  });

  if (!chapter) {
    throw new Error("Chapter not found");
  }

  await db.chapter.delete({
    where: {
      id,
    },
  });

  revalidatePath(`/admin/course/${chapter.courseId}`);

  return {
    success: "Chapter deleted",
  };
};
