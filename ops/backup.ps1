param(
  [string]$OutputDir = ".\backups"
)

$ErrorActionPreference = "Stop"
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$resolvedOutput = Resolve-Path -Path $OutputDir -ErrorAction SilentlyContinue

if (-not $resolvedOutput) {
  New-Item -ItemType Directory -Path $OutputDir | Out-Null
  $resolvedOutput = Resolve-Path -Path $OutputDir
}

$backupPath = Join-Path $resolvedOutput "blog-$timestamp.sql"
$postgresUser = if ($env:POSTGRES_USER) { $env:POSTGRES_USER } else { "blog" }
$postgresDb = if ($env:POSTGRES_DB) { $env:POSTGRES_DB } else { "blog" }
docker compose exec -T db pg_dump -U $postgresUser $postgresDb | Out-File -FilePath $backupPath -Encoding utf8
Write-Host "Database backup written to $backupPath"
