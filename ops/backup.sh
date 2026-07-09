#!/usr/bin/env sh
set -eu

OUTPUT_DIR="${1:-./backups}"
POSTGRES_USER="${POSTGRES_USER:-blog}"
POSTGRES_DB="${POSTGRES_DB:-blog}"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"

mkdir -p "$OUTPUT_DIR"
docker compose exec -T db pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" > "$OUTPUT_DIR/blog-$TIMESTAMP.sql"
echo "Database backup written to $OUTPUT_DIR/blog-$TIMESTAMP.sql"
