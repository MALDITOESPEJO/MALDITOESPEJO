<#
.SYNOPSIS
  MALDITOESPEJO — Abre un caso completo (investigate -> claims -> dependencies -> research:plan)
  en un solo paso, capturando el CASE-ID real y sustituyendolo automaticamente.

.USAGE
  .\scripts\case-open.ps1 -LeadFile "lead-mi-tema.txt"

  El .txt del lead debe estar ya en la raiz del proyecto (D:\MALDITO ESPEJO).
#>

param(
    [Parameter(Mandatory = $true)]
    [string]$LeadFile
)

$ErrorActionPreference = "Stop"

function Run-Step {
    param([string]$Title, [scriptblock]$Cmd)
    Write-Host ""
    Write-Host "=== $Title ===" -ForegroundColor Cyan
    $output = & $Cmd 2>&1 | Out-String
    Write-Host $output
    if ($LASTEXITCODE -ne 0) {
        Write-Host "FALLO en '$Title'. Deteniendo el script." -ForegroundColor Red
        exit 1
    }
    return $output
}

if (-not (Test-Path $LeadFile)) {
    Write-Host "No existe el archivo '$LeadFile' en $(Get-Location). Colocalo en la raiz del proyecto antes de lanzar el script." -ForegroundColor Red
    exit 1
}

# 1. investigate — captura el CASE-ID real de la salida
$investigateOutput = Run-Step "investigate" { npm run investigate -- --input $LeadFile }

$match = [regex]::Match($investigateOutput, "CASE-\d+")
if (-not $match.Success) {
    Write-Host "No se pudo extraer el CASE-ID de la salida de investigate. Revisa el mensaje arriba." -ForegroundColor Red
    exit 1
}
$caseId = $match.Value
Write-Host ""
Write-Host ">>> CASE-ID detectado: $caseId" -ForegroundColor Green

# 2. claims
Run-Step "claims" { npm run claims -- --case $caseId }

# 3. claim:dependencies
Run-Step "claim:dependencies" { npm run claim:dependencies -- --case $caseId }

# 4. research:plan
Run-Step "research:plan" { npm run research:plan -- --case $caseId }

# 5. mostrar el JSON final del caso
Write-Host ""
Write-Host "=== Caso listo para investigacion documental ===" -ForegroundColor Cyan
Get-Content "editorial\cases\$caseId.json"

Write-Host ""
Write-Host ">>> CASE-ID: $caseId" -ForegroundColor Green
Write-Host ">>> Siguiente paso: construir editorial\cases\$caseId.web-results.json con la evidencia real, y lanzar case-evidence.ps1 -Case $caseId -WebResults <ruta>" -ForegroundColor Yellow
