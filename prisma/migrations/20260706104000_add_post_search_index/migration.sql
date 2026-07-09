CREATE INDEX "Post_search_idx" ON "Post"
USING GIN (to_tsvector('simple', "title" || ' ' || "excerpt" || ' ' || "content"));
