#!/bin/bash

# Determine current branch
BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo "--------------------------------------"
echo "🚀 NCAI DEPLOYMENT GATEWAY"
echo "Current Branch: $BRANCH"
echo "--------------------------------------"

# 1. Ask for the commit message
read -p "📝 Enter commit message: " MESSAGE

if [ -z "$MESSAGE" ]; then
  echo "❌ Error: Commit message is required."
  exit 1
fi

# 2. Ask for the deployment target
echo ""
echo "Select your push target:"
echo "1) ⚡ Push to LIVE/PREVIEW (Triggers Vercel Rebuild)"
echo "2) 💾 Version Control Only (Adds [skip ci] - No Rebuild)"
read -p "Enter choice [1 or 2]: " CHOICE

# 3. Handle the logic
if [ "$CHOICE" == "2" ]; then
  FINAL_MESSAGE="$MESSAGE [skip ci]"
  echo "✅ Strategy: Version Control Only (Skipping Vercel)"
else
  FINAL_MESSAGE="$MESSAGE"
  echo "🚀 Strategy: Full Site Rebuild"
fi

# 4. Execute
git add .
git commit -m "$FINAL_MESSAGE"
git push origin "$BRANCH"

echo ""
echo "✨ Push Complete!"
