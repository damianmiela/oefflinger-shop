# Sync product descriptions (post_content, post_excerpt) from local to production
# Fixes encoding corruption from initial migration. Run from project root.

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$DeployDir = Join-Path $ProjectRoot "deploy"

$LocalMysqlContainer = "docker-mysql-1"
$ProdHost = "root@91.98.112.186"
$ProdMysqlContainer = "oefflinger-mysql-1"
$DbName = "oefflinger_wp"
$DbUser = "oefflinger_db"

$EnvFile = Join-Path $ProjectRoot ".env"
$DbPassword = (Get-Content $EnvFile | Where-Object { $_ -match "^MYSQL_PASSWORD=(.+)$" }) -replace "MYSQL_PASSWORD=", ""
$DbPassword = $DbPassword.Trim()

Write-Host "=== Syncing product descriptions (local -> production) ===" -ForegroundColor Cyan

# Export product updates from local - use sql file to avoid escaping
$UpdatesFile = Join-Path $DeployDir "product_updates.sql"
$ExportSql = Join-Path $DeployDir "export_product_descriptions.sql"

# Copy sql into container and run (avoids PowerShell encoding of long strings)
docker cp $ExportSql "${LocalMysqlContainer}:/tmp/export_desc.sql"
$env:MYSQL_PWD = $DbPassword
$ErrorActionPreference = "Continue"
cmd /c "docker exec -e MYSQL_PWD $LocalMysqlContainer mysql -u $DbUser $DbName -N --default-character-set=utf8mb4 -e `"source /tmp/export_desc.sql`" 2>nul > `"$UpdatesFile`""
$env:MYSQL_PWD = $null
$ErrorActionPreference = "Stop"

$lineCount = (Get-Content $UpdatesFile -Encoding UTF8 -ErrorAction SilentlyContinue | Where-Object { $_ -match '^UPDATE ' } | Measure-Object -Line).Lines
if ($lineCount -eq 0) {
    Write-Error "No product updates exported. Is local Docker running?"
}

Write-Host "  Exported $lineCount product updates" -ForegroundColor Green

# Replace localhost URLs with production
$content = Get-Content $UpdatesFile -Raw -Encoding UTF8
$content = $content -replace 'http://localhost:4001', 'http://91.98.112.186:4001'
[System.IO.File]::WriteAllText($UpdatesFile, $content, [System.Text.UTF8Encoding]::new($false))

# Upload and run on production
scp $UpdatesFile "${ProdHost}:/tmp/product_updates.sql"
ssh $ProdHost "docker cp /tmp/product_updates.sql ${ProdMysqlContainer}:/tmp/ && docker exec -e MYSQL_PWD='$DbPassword' -i ${ProdMysqlContainer} sh -c 'mysql -u $DbUser $DbName < /tmp/product_updates.sql'"
ssh $ProdHost "rm -f /tmp/product_updates.sql"
Remove-Item $UpdatesFile -Force -ErrorAction SilentlyContinue

Write-Host "  Descriptions synced." -ForegroundColor Green
