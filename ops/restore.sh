#!/usr/bin/env sh
set -eu

if [ $# -lt 1 ]; then
  echo "Usage: ./ops/restore.sh ./backups/blog-YYYYMMDD-HHMMSS.sql"
  exit 1
fi

POSTGRES_USER="${POSTGRES_USER:-blog}"
POSTGRES_DB="${POSTGRES_DB:-blog}"

docker compose exec -T db psql -U "$POSTGRES_USER" "$POSTGRES_DB" < "$1"
echo "Database restored from $1"
