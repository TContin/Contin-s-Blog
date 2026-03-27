$root = "c:\Users\v_dingkang\CodeBuddy\20260327140746"
$files = Get-ChildItem -Path $root -Recurse -Include "*.html","*.js","*.md" | Where-Object { $_.FullName -notlike "*\.codebuddy\*" -and $_.FullName -notlike "*node_modules*" }

foreach ($f in $files) {
    $content = Get-Content $f.FullName -Raw -Encoding UTF8
    if ($content -match "Alex") {
        $content = $content -replace "Alex's Blog", "Contin's Blog"
        $content = $content -replace "Alex Chen", "Contin"
        Set-Content $f.FullName -Value $content -Encoding UTF8 -NoNewline
        Write-Host "Updated: $($f.Name)"
    }
}
Write-Host "Done!"
