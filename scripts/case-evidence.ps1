<#
.SYNOPSIS
  MALDITOESPEJO — Encadena la fase de evidencia del motor de casos en dos modos.

.MODO A (importar y recuperar; no requiere juicio editorial):
  .\scripts\case-evidence.ps1 -Case CASE-00000007 -WebResults "editorial\cases\CASE-00000007.web-results.json"

  Ejecuta web:import + evidence:retrieve, muestra el resultado, y se detiene ahi.
  El siguiente paso (decidir source_role/assessment de cada candidato) es juicio
  editorial real y no se automatiza aqui.

.MODO B (aceptar evidencia ya revisada y verificar; continua desde donde se quedo el Modo A):
  .\scripts\case-evidence.ps1 -Case CASE-00000007 -ReviewedFile "editorial\cases\CASE-00000007.evidence-reviewed.json"

  Ejecuta evidence:accept + sufficiency + independence:enforce + temporal:verify + verify
  + scope + article:original + language:guard, y muestra el JSON final del caso.

  IMPORTANTE: nunca vuelve a llamar a evidence:prepare en ningun punto — sobrescribe
  el resultado real de evidence:retrieve con un esqueleto vacio.
#>

param(
    [Parameter(Mandatory = $true)]
    [string]$Case,

    [string]$WebResults,

    [string]$ReviewedFile
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

if (-not $WebResults -and -not $ReviewedFile) {
    Write-Host "Hay que pasar -WebResults (Modo A) o -ReviewedFile (Modo B). Ver la cabecera del script (Get-Help .\case-evidence.ps1 -Full)." -ForegroundColor Red
    exit 1
}

if ($WebResults) {
    # ---- MODO A: importar y recuperar ----
    if (-not (Test-Path $WebResults)) {
        Write-Host "No existe '$WebResults'." -ForegroundColor Red
        exit 1
    }

    Run-Step "web:import" { npm run web:import -- --input $WebResults }
    Run-Step "evidence:retrieve" { npm run evidence:retrieve -- --case $Case }

    Write-Host ""
    Write-Host "=== Candidatos recuperados (revisalos antes de construir el archivo de aceptacion) ===" -ForegroundColor Cyan
    Get-Content "editorial\cases\$Case.evidence-candidates.json"

    Write-Host ""
    Write-Host ">>> Siguiente paso: construir editorial\cases\$Case.evidence-reviewed.json con source_role/assessment revisados, y volver a lanzar:" -ForegroundColor Yellow
    Write-Host "    .\scripts\case-evidence.ps1 -Case $Case -ReviewedFile editorial\cases\$Case.evidence-reviewed.json" -ForegroundColor Yellow
    exit 0
}

# ---- MODO B: aceptar evidencia revisada y verificar ----
if (-not (Test-Path $ReviewedFile)) {
    Write-Host "No existe '$ReviewedFile'." -ForegroundColor Red
    exit 1
}

Run-Step "evidence:accept" { npm run evidence:accept -- --case $Case --input $ReviewedFile }
Run-Step "evidence:sufficiency" { npm run evidence:sufficiency -- --case $Case }
Run-Step "independence:enforce" { npm run independence:enforce -- --case $Case }
Run-Step "temporal:verify" { npm run temporal:verify -- --case $Case }
Run-Step "verify" { npm run verify -- --case $Case }
Run-Step "scope" { npm run scope -- --case $Case }
Run-Step "article:original" { npm run article:original -- --case $Case }
Run-Step "language:guard" { npm run language:guard -- --case $Case }

Write-Host ""
Write-Host "=== Estado final del caso ===" -ForegroundColor Cyan
Get-Content "editorial\cases\$Case.json"
