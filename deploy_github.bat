@echo off
echo ====================================================================
echo   Aura Campus Digital Twin - Pushing to github.com/rupamghosh3000/AuraCampus
echo ====================================================================
echo.

git status >nul 2>&1
if %errorlevel% neq 0 (
    echo [1/4] Initializing Git repository...
    git init
    git branch -M main
) else (
    echo [1/4] Git repository already initialized.
)

echo [2/4] Staging project files...
git add .

echo [3/4] Creating commit...
git commit -m "Deploy Aura Campus Digital Twin platform with GitHub Actions & Pages support"

echo [4/4] Setting remote origin to https://github.com/rupamghosh3000/AuraCampus.git ...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/rupamghosh3000/AuraCampus.git

echo.
echo Pushing code to main branch...
git push -u origin main

echo.
echo ====================================================================
echo  DONE! Your code is pushed to https://github.com/rupamghosh3000/AuraCampus
echo.
echo  NEXT STEP:
echo  Enable GitHub Pages:
echo  1. Go to https://github.com/rupamghosh3000/AuraCampus/settings/pages
echo  2. Under "Build and deployment" -> "Source", select "GitHub Actions"
echo  3. Your live site will be at https://rupamghosh3000.github.io/AuraCampus/
echo ====================================================================
echo.
pause
