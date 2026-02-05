# Light Meter Pro - PWA

A professional light meter app for photography with spot metering capabilities.

## Features
- Real-time spot metering using your phone's camera
- ISO selection (100-6400)
- Live EV (Exposure Value) readings
- Suggested aperture and shutter speed combinations
- Clean, minimal interface designed for photographers
- Works offline once installed

## Installation Instructions

### Step 1: Upload to GitHub

1. Create a new repository on GitHub (e.g., "lightmeter-pwa")
2. Upload all these files to the repository:
   - `index.html`
   - `app.js`
   - `sw.js`
   - `manifest.json`
   - `icon-192.png`
   - `icon-512.png`
   - `README.md` (this file)

### Step 2: Enable GitHub Pages

1. Go to your repository settings
2. Navigate to "Pages" in the left sidebar
3. Under "Source", select "main" branch and "/ (root)" folder
4. Click "Save"
5. Wait a few minutes for GitHub to build your site
6. Your app will be available at: `https://[your-username].github.io/[repository-name]/`

### Step 3: Convert to APK using PWA Builder

1. Go to https://www.pwabuilder.com/
2. Enter your GitHub Pages URL: `https://[your-username].github.io/[repository-name]/`
3. Click "Start"
4. Wait for PWA Builder to analyze your site
5. Click "Package For Stores"
6. Select "Android" platform
7. Choose "Trusted Web Activity" (TWA) option
8. Click "Generate"
9. Download the APK file
10. Transfer the APK to your Android phone
11. Enable "Install from unknown sources" in your phone settings
12. Install the APK

### Alternative: Install as PWA (No APK needed)

For a simpler approach without creating an APK:

1. Open your GitHub Pages URL in Chrome on your Android phone
2. Tap the menu (three dots)
3. Select "Add to Home Screen"
4. The app will install and appear on your home screen like a native app

## Usage

1. Open the app
2. Grant camera permission when prompted
3. Select your ISO from the top-right dropdown
4. Point your camera at what you want to meter
5. The green circle in the center shows the metering spot
6. Read the EV value and suggested settings at the bottom

## Technical Notes

- Uses the rear camera by default
- Meters approximately 10% of the center frame
- EV calculations based on ISO and measured luminance
- Suggested settings use f/5.6 as a baseline aperture
- Works entirely offline after first load

## Browser Requirements

- Modern browser with camera API support
- HTTPS required (GitHub Pages provides this automatically)
- Best experienced on mobile devices

## Customization

To modify the calibration:
- Edit the `K` constant in `app.js` (line 92) to adjust EV readings
- Modify `suggestedAperture` in `app.js` (line 130) to change baseline aperture

## License

MIT License - Feel free to modify and distribute
