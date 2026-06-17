@echo off
echo ========================================
echo PC WALA V3 - DEPLOYMENT PREPARATION
echo ========================================
echo.

echo [1/4] Checking current folder size...
dir /s | find "File(s)"
echo.

echo [2/4] Deleting .next build folder...
if exist .next (
    rmdir /s /q .next
    echo ✓ .next folder deleted successfully
) else (
    echo ✓ .next folder not found (already clean)
)
echo.

echo [3/4] Running production build test...
echo This will take 1-2 minutes...
call npm run build
if %errorlevel% neq 0 (
    echo ✗ Build failed! Check errors above.
    pause
    exit /b 1
)
echo ✓ Build completed successfully
echo.

echo [4/4] Checking final size...
dir /s | find "File(s)"
echo.

echo ========================================
echo DEPLOYMENT PREPARATION COMPLETE!
echo ========================================
echo.
echo Next steps:
echo 1. Push to Git repository
echo 2. Connect Vercel to your repo
echo 3. Add environment variables in Vercel
echo 4. Deploy!
echo.
echo See OPTIMIZATION_REPORT.txt for details.
echo.
pause
