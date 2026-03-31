#!/bin/bash
# ============================================
# SAHARA — Initial GitHub Setup Script
# Run this ONCE after cloning your empty repo
# ============================================

echo "🏥 Setting up SAHARA project..."

# 1. Copy all files into your cloned repo
# (Run this script from the project root)

# 2. Git init (if not already)
git init

# 3. Add remote (already created on GitHub)
git remote add origin https://github.com/Ayesha0000000/SAHARA-Smart-AI-Healthcare-Assistance-Rapid-Aid-.git

# 4. Stage all files
git add .

# 5. Initial commit
git commit -m "🎉 Initial project setup — SAHARA structure, backend skeleton, ML plan, README"

# 6. Push to main
git branch -M main
git push -u origin main

echo "✅ Done! SAHARA is on GitHub."
