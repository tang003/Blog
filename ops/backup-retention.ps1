$backupDir = Join-Path (Get-Location) "backups"
$keep = [int]($env:BACKUP_KEEP_COUNT ?? "14")

if (!(Test-Path $backupDir)) {
  exit 0
}

Get-ChildItem -Path $backupDir -Filter "blog-*.sql" |
  Sort-Object LastWriteTime -Descending |
  Select-Object -Skip $keep |
  Remove-Item -Force
