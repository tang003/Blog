param(
  [Parameter(Mandatory = $true)]
  [string]$BackupPath
)

$ErrorActionPreference = "Stop"
$resolvedBackup = Resolve-Path -Path $BackupPath
$postgresUser = if ($env:POSTGRES_USER) { $env:POSTGRES_USER } else { "blog" }
$postgresDb = if ($env:POSTGRES_DB) { $env:POSTGRES_DB } else { "blog" }
Get-Content -Raw -Path $resolvedBackup | docker compose exec -T db psql -U $postgresUser $postgresDb
Write-Host "Database restored from $resolvedBackup"
