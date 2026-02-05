# Light Meter Pro - PWA

A professional light meter app for photography with spot metering capabilities.

## Features
- **Fully Offline** - Works without internet connection after first load
- **Live Camera Preview** - See what you're metering in real-time in a dedicated preview window
- **Meter Button** - Capture and freeze readings with a single tap
- **Two Metering Modes:**
  - **Spot Metering** - Precise measurement of center area (10% of frame)
  - **Ambient Metering** - Center-weighted average of entire scene
- **Exposure Combinations Bar** - See all equivalent aperture/shutter combinations for proper exposure
- Real-time metering using your phone's camera
- ISO selection (100-6400)
- Live EV (Exposure Value) readings
- Suggested aperture and shutter speed combinations (highlighted in green)
- **Calibration Guide** - Compare and verify accuracy against your phone's camera
- Clean, minimal interface designed for photographers
- Offline indicator shows connection status
- Progressive Web App (PWA) - installs like a native app

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
3. **Live View Mode:**
   - See the full camera feed
   - Watch the live preview window (top-right) showing what's being metered
   - Select metering mode (Spot or Ambient) and ISO as needed
4. **Press "METER" button** to capture a reading
5. **Metering Mode:**
   - Reading is frozen and displayed prominently
   - See all exposure combinations in the scrollable bar
   - Review aperture/shutter suggestions
   - The button turns red and shows "RELEASE"
6. **Press "RELEASE"** to return to live view mode

### Live Preview Window

The small preview window in the top-right corner shows you exactly what area is being metered:
- **Spot Mode**: Shows the center 10% of the frame being measured
- **Ambient Mode**: Shows the center 40% with weighted averaging
- Updates in real-time so you can compose your shot
- Perfect for checking exposure before taking the meter reading

### Meter Button Workflow

**Use Case 1 - Quick Reading:**
1. Point camera at subject
2. Press METER
3. Note the settings
4. Press RELEASE
5. Adjust camera and shoot

**Use Case 2 - Comparing Multiple Readings:**
1. Point at highlight, press METER → note EV 14.5
2. Press RELEASE
3. Point at shadow, press METER → note EV 8.2
4. Calculate dynamic range: 6.3 stops difference
5. Determine exposure strategy

**Use Case 3 - Finding 18% Gray:**
1. Meter different parts of scene
2. Find area reading EV 12-13 (middle gray)
3. Expose for that area for balanced exposure

### Understanding the Combinations Bar

The horizontal scrollable bar shows all valid aperture/shutter speed combinations that produce the same exposure:
- **All combinations are equivalent** - they let in the same amount of light
- **Highlighted card** - The suggested middle-ground setting (usually around f/5.6-f/8)
- **Wide apertures (f/1.4-f/4)** - Shallow depth of field, faster shutter speeds
- **Narrow apertures (f/11-f/22)** - Deep depth of field, slower shutter speeds
- **Swipe left/right** to see all available combinations
- Choose based on your creative needs (bokeh vs. sharpness, motion blur vs. freeze action)

**Example:** If the bar shows f/2.8 @ 1/500s and f/8 @ 1/60s:
- Use f/2.8 for portraits with blurred backgrounds
- Use f/8 for landscapes with everything in focus
- Both give the same exposure, different creative results!

### Metering Modes

**Spot Metering:**
- Measures light from the small green circle in the center (10% of frame)
- Best for precise metering of specific subjects
- Use when you want to expose for a particular area (face, sky, etc.)
- Ideal for high-contrast scenes and backlit subjects

**Ambient Metering:**
- Measures entire frame with center-weighted averaging
- Best for general scenes with balanced lighting
- The circle becomes larger and dashed to show broader coverage
- Similar to evaluative/matrix metering in DSLR cameras

### Calibration & Accuracy

The app includes a built-in **Calibration Guide** (accessible from the settings panel) to help you:
- Compare readings against your phone's camera metering
- Understand EV calculations and exposure equivalents
- Fine-tune accuracy if needed
- Learn when to use each metering mode

**Quick Accuracy Test:**
1. Open your phone's camera app in manual/pro mode
2. Set the same ISO in both apps (e.g., ISO 400)
3. Point at the same neutral scene
4. Compare the EV values - they should be within ±1 EV
5. If consistently off, use the calibration guide to adjust

### Offline Usage

The app works completely offline after the first load:
- Open the app once while online to cache all resources
- After that, you can use it anywhere without internet
- The app will show an "Offline Mode" indicator when not connected
- All features (camera, metering, calculations) work offline
- Perfect for outdoor shooting in remote locations!

**To test offline mode:**
1. Open the app while online
2. Turn on Airplane Mode on your phone
3. The app continues to work perfectly!


## Technical Notes

**Metering:**
- Spot mode: Samples approximately 10% of center frame
- Ambient mode: Center-weighted with Gaussian falloff from center
- Both use ITU-R BT.709 luminance calculation (0.2126×R + 0.7152×G + 0.0722×B)

**EV Calculation:**
- Based on APEX system (Additive System of Photographic Exposure)
- Uses calibration constant K=12.5 (adjustable for your specific phone)
- Formula: EV = log₂(N²/t) where N=f-number, t=shutter speed
- Suggested settings use f/5.6 as baseline aperture

**Accuracy:**
- Typical accuracy: ±0.5-1.0 EV compared to dedicated light meters
- Variations due to phone sensor differences and lens coatings
- Use calibration guide to optimize for your specific device
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
