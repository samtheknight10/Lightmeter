# Quick Setup Guide

## Upload to GitHub (5 minutes)

1. **Create GitHub Account** (if you don't have one)
   - Go to github.com
   - Click "Sign up"

2. **Create New Repository**
   - Click the "+" icon in top right
   - Select "New repository"
   - Name it "lightmeter-pwa"
   - Make it PUBLIC (required for GitHub Pages)
   - Click "Create repository"

3. **Upload Files**
   - Click "uploading an existing file"
   - Drag and drop ALL 7 files:
     * index.html
     * app.js
     * sw.js
     * manifest.json
     * icon-192.png
     * icon-512.png
     * README.md
   - Click "Commit changes"

4. **Enable GitHub Pages**
   - Go to Settings tab
   - Click "Pages" in left sidebar
   - Under "Source", select "main" branch
   - Click "Save"
   - Wait 2-3 minutes

5. **Get Your URL**
   - Your app will be at: https://YOUR-USERNAME.github.io/lightmeter-pwa/
   - Test it in your phone's browser first!

## Convert to APK with PWA Builder (3 minutes)

1. Go to **https://www.pwabuilder.com/**
2. Paste your GitHub Pages URL
3. Click "Start"
4. After analysis, click "Package For Stores"
5. Click "Android"
6. Click "Generate" (use default options)
7. Download the ZIP file
8. Extract and find the APK file

## Install APK on Android

1. Transfer APK to your phone (email, USB, cloud storage)
2. Settings → Security → Enable "Install unknown apps" for your file manager
3. Open the APK file
4. Click "Install"
5. Done! The app is now on your home screen

## Even Easier Option: Just Add to Home Screen

Instead of making an APK, you can:
1. Open your GitHub Pages URL in Chrome on your phone
2. Menu → "Add to Home Screen"
3. It installs like a native app, no APK needed!

---

**Need Help?**
- Make sure repository is PUBLIC
- Wait a few minutes after enabling GitHub Pages
- Test the URL in a browser before using PWA Builder
- HTTPS is required (GitHub Pages provides this automatically)
