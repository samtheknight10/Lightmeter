# Light Meter Pro - PWA

A professional light meter app for photography with spot metering capabilities.

## Features
- **Fully Offline** - Works without internet connection after first load
- **Elegant Color Scheme** - Dark grey-blue background with bone white accents
- **Portrait Mode Optimized** - Locked to portrait orientation for consistent use
- **Freeze/Resume Metering** - Lock readings with one tap, press again to resume
- **Continuous Real-time Updates** - Readings update constantly when not frozen
- **Live Camera Preview** - See what you're metering in a dedicated preview window
- **Persistent Meter Button** - Always visible, press to freeze/unfreeze readings
- **Two Metering Modes:**
  - **Spot Metering** - Precise measurement of center area (10% of frame)
  - **Ambient Metering** - Center-weighted average of entire scene
- **Minimal Exposure Sidebar** - 5 key aperture/shutter combinations shown vertically
- Real-time metering using your phone's camera
- ISO selection (100-6400)
- Live EV (Exposure Value) readings
- Suggested aperture and shutter speed (highlighted with accent color)
- **Calibration Guide** - Compare and verify accuracy against your phone's camera
- Clean, professional interface designed for photographers
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
3. **The app continuously meters in real-time:**
   - Live camera feed in background
   - Live preview window (top-right) shows metering area
   - EV reading updates constantly
   - Exposure combinations update in sidebar
   - Settings panel shows at bottom
4. **Press "METER" button to freeze the current reading:**
   - Button changes to "FROZEN" and glows
   - All readings are locked at that moment
   - Camera continues to show live feed
   - Readings stay frozen until you press again
5. **Press "FROZEN" button to resume live metering:**
   - Button returns to "METER"
   - All values immediately resume updating
   - Perfect for comparing multiple scenes

### Workflow Examples

**Scenario 1 - Simple Metering:**
1. Point camera at subject
2. Watch EV update in real-time
3. Press METER to freeze the reading
4. Set your camera to the displayed settings
5. Press FROZEN to resume for next shot

**Scenario 2 - Comparing Highlights vs Shadows:**
1. Point at bright area → Press METER → Note EV 15.2
2. Press FROZEN to resume
3. Point at shadow → Press METER → Note EV 8.7
4. Calculate: 6.5 stops dynamic range
5. Determine if you need ND grad filter

**Scenario 3 - Zone System Metering:**
1. Meter different parts of scene
2. Freeze each reading to note values
3. Find middle gray (around EV 12-13)
4. Expose for that zone

### Interface Layout (Portrait Mode)

The app is optimized and locked to portrait orientation:

```
┌─────────────────────────┐
│ [Light Meter]  [Spot][ISO]│ ← Top bar
│                         │
│  [Live Preview]    [f/2.8]│ ← Preview + Sidebar
│                    [1/500]│
│                    [f/4  ]│ ← 5 exposure
│       Camera View  [1/250]│   combinations
│                    [f/5.6]│   (bone white)
│                    [1/125]│ ← Suggested (bright)
│         EV 12.5    [f/8  ]│
│                    [1/60 ]│
│                    [f/11 ]│
│                    [1/30 ]│
│    [METER/FROZEN]        │ ← Toggle freeze
│                         │
│ Aperture: f/5.6         │ ← Settings panel
│ Shutter:  1/125         │   (grey-blue)
│ ⚙️ Calibration Guide    │
└─────────────────────────┘

Button States:
• "METER" - Press to freeze current reading
• "FROZEN" - Readings locked, press to resume
```

### Live Preview Window

The small preview window in the top-right corner shows you exactly what area is being metered:
- **Spot Mode**: Shows the center 10% of the frame being measured
- **Ambient Mode**: Shows the center 40% with weighted averaging
- Updates in real-time so you can compose your shot
- Perfect for checking what's being analyzed

### Exposure Sidebar

The vertical sidebar on the right shows 5 key exposure combinations:
- **2 wider apertures** (more blur, faster shutter)
- **Suggested setting** (highlighted in green)
- **2 narrower apertures** (more focus, slower shutter)
- All combinations give the same exposure
- Choose based on your creative needs

**Example:**
If you see f/2.8@1/500, f/4@1/250, **f/5.6@1/125**, f/8@1/60, f/11@1/30:
- Use f/2.8 for portraits with background blur
- Use f/11 for landscapes with everything sharp
- Both are correctly exposed!

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
