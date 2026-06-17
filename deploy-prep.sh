#!/bin/bash

echo "========================================"
echo "PC WALA V3 - DEPLOYMENT PREPARATION"
echo "========================================"
echo ""

echo "[1/4] Checking current folder size..."
du -sh .
echo ""

echo "[2/4] Deleting .next build folder..."
if [ -d ".next" ]; then
    rm -rf .next
    echo "✓ .next folder deleted successfully"
else
    echo "✓ .next folder not found (already clean)"
fi
echo ""

echo "[3/4] Running production build test..."
echo "This will take 1-2 minutes..."
npm run build
if [ $? -ne 0 ]; then
    echo "✗ Build failed! Check errors above."
    exit 1
fi
echo "✓ Build completed successfully"
echo ""

echo "[4/4] Checking final size..."
du -sh .
echo ""

echo "========================================"
echo "DEPLOYMENT PREPARATION COMPLETE!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Push to Git repository"
echo "2. Connect Vercel to your repo"
echo "3. Add environment variables in Vercel"
echo "4. Deploy!"
echo ""
echo "See OPTIMIZATION_REPORT.txt for details."
echo ""
