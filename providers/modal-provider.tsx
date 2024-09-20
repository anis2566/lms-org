"use client";

import { DeleteCategoryModal } from "@/app/admin/category/_components/delete-modal";
import { DeleteCourseModal } from "@/app/admin/course/[id]/_components/delete-modal";
import { DeleteChapterModal } from "@/app/admin/course/[id]/chapter/[chapterId]/_components/delete-chapter-modal";
import { DeleteAttachmentModal } from "@/app/admin/course/[id]/chapter/[chapterId]/_components/delete-modal";

export const ModalProvider = () => {
  return (
    <>
      <DeleteCategoryModal />
      <DeleteAttachmentModal />
      <DeleteChapterModal />
      <DeleteCourseModal />
    </>
  );
};
