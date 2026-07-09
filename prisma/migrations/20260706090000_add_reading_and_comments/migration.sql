ALTER TABLE "Post" ADD COLUMN "coverImage" TEXT;
ALTER TABLE "Post" ADD COLUMN "viewCount" INTEGER NOT NULL DEFAULT 0;

CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "email" TEXT,
    "content" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Comment_postId_approved_createdAt_idx" ON "Comment"("postId", "approved", "createdAt");

ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
