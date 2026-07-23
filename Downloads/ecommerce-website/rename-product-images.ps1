# =====================================================================
# One-time rename of uploaded product photos to clean, deploy-safe names.
#
# WHY: several uploaded .jpg files have spaces, emoji, curly quotes, and
# symbols in their names, which break image URLs in production. This
# renames them to simple slugs that the catalog (lib/products.ts) already
# points at.
#
# HOW TO RUN (Windows):
#   1. Open the project folder:  C:\Users\pc\Downloads\ecomarce website
#   2. Right-click this file  ->  "Run with PowerShell"
#      (or in a terminal:  powershell -ExecutionPolicy Bypass -File .\rename-product-images.ps1)
#
# Safe to run more than once — already-renamed files are skipped.
# =====================================================================

$pub = Join-Path $PSScriptRoot 'public'
if (-not (Test-Path $pub)) { Write-Error "public/ folder not found next to this script."; exit 1 }

function Rename-Group([string]$pattern, [string]$prefix, [string]$ext = 'jpg') {
  $i = 1
  Get-ChildItem -LiteralPath $pub -File | Where-Object { $_.Name -like $pattern } |
    Sort-Object Name | ForEach-Object {
      $target = "$prefix-$i.$ext"
      if ($_.Name -ne $target) { Rename-Item -LiteralPath $_.FullName -NewName $target -Force }
      $i++
    }
}

function Rename-One([string]$pattern, [string]$target) {
  $f = Get-ChildItem -LiteralPath $pub -File | Where-Object { $_.Name -like $pattern } | Select-Object -First 1
  if ($f -and $f.Name -ne $target) { Rename-Item -LiteralPath $f.FullName -NewName $target -Force }
}

# --- Multi-angle series -> galleries ---
Rename-Group 'Last day to get mugs*' 'mugs'
Rename-Group 'Some cups from*'       'cups'
Rename-Group '*Midnight dew*'        'midnight-dew'
Rename-Group 'Kopal Seth*work embodies*' 'tensions'
Rename-Group 'Venturing into*'       'blue-white'

# --- Single pieces ---
Rename-One 'This piece titled*Obscured*'      'obscured-spaces.jpg'
Rename-One '*Reverie*series totems*'          'reverie-totems.jpg'
Rename-One 'Hand made ceramic table ware*'    'tableware-set.jpg'
Rename-One 'This beautiful piece*back to earth*' 'back-to-earth.jpg'
Rename-One 'Lidded pots*'                     'lidded-pots.jpg'
Rename-One 'Tumblers and jars*'               'tumblers-jars.jpg'
Rename-One 'Bowl and dish*'                   'bowl-dish.jpg'

# --- Non-product posts -> journal-* (not added as products) ---
Rename-One 'Extremely glad*Ravi Jain*'        'journal-award.jpg'
Rename-One '@baromarket*'                      'journal-baromarket.jpg'
Rename-One 'Shop now on my website*'          'journal-shop.jpg'
Rename-One 'Hey guys my payment portal*'      'journal-portal.jpg'
Rename-One 'Hello everyone*setting up my studio*' 'journal-studio.jpg'
Rename-One '447740930_*'                       'piece-archive.jpg'

# --- Stray avif with a space in its name ---
Rename-One '3A copy.avif' '28.avif'

Write-Host ''
Write-Host 'Done. Product photos in public/ have been renamed to clean slugs.'
Write-Host 'Refresh your dev server (npm run dev) to see all products.'
