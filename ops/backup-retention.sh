#!/bin/sh
set -eu

BACKUP_DIR="${BACKUP_DIR:-./backups}"
KEEP="${BACKUP_KEEP_COUNT:-14}"

if [ ! -d "$BACKUP_DIR" ]; then
  exit 0
fi

find "$BACKUP_DIR" -maxdepth 1 -name 'blog-*.sql' -type f -printf '%T@ %p\n' |
  sort -nr |
  awk "NR > $KEEP {print substr(\$0, index(\$0,\$2))}" |
  xargs -r rm -f
