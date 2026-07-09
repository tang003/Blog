CREATE TABLE "LoginAttempt" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginAttempt_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PageView" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "referrer" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DailyPostView" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DailyPostView_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AiDocument" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "chunk" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "embedding" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiDocument_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "LoginAttempt_identifier_createdAt_idx" ON "LoginAttempt"("identifier", "createdAt");
CREATE INDEX "PageView_path_createdAt_idx" ON "PageView"("path", "createdAt");
CREATE INDEX "DailyPostView_date_idx" ON "DailyPostView"("date");
CREATE UNIQUE INDEX "DailyPostView_postId_date_key" ON "DailyPostView"("postId", "date");
CREATE INDEX "AiDocument_postId_idx" ON "AiDocument"("postId");
CREATE UNIQUE INDEX "AiDocument_postId_chunk_key" ON "AiDocument"("postId", "chunk");

ALTER TABLE "DailyPostView" ADD CONSTRAINT "DailyPostView_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AiDocument" ADD CONSTRAINT "AiDocument_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
