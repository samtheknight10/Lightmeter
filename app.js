let stream = null;
let animationFrameId = null;
let currentISO = 400;
let meteringMode = 'spot'; // 'spot' or 'ambient'
let isFrozen = false; // true when readings are frozen
let frozenEV = null; // stored EV value when frozen
let frozenCombinations = []; // stored combinations when frozen
let frozenSuggestedIndex = 0; // stored suggested index when frozen

const video = document.getElementById('camera');
const canvas = document.getElementById('analysis-canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const permissionScreen = document.getElementById('permission-screen');
const evValue = document.getElementById('ev-value');
const apertureValue = document.getElementById('aperture-value');
const shutterValue = document.getElementById('shutter-value');
const isoSelector = document.getElementById('iso-selector');
const meteringModeSelector = document.getElementById('metering-mode');
const spotIndicator = document.getElementById('spot-indicator');
const exposureSidebar = document.getElementById('exposure-sidebar');
const meterButton = document.getElementById('meter-button');
const meterButtonText = document.getElementById('meter-button-text');
const previewCanvas = document.getElementById('preview-canvas');
const previewCtx = previewCanvas.getContext('2d');

// Set default ISO
isoSelector.value = '400';

isoSelector.addEventListener('change', (e) => {
    currentISO = parseInt(e.target.value);
});

meteringModeSelector.addEventListener('change', (e) => {
    meteringMode = e.target.value;
    if (meteringMode === 'ambient') {
        spotIndicator.classList.add('ambient-mode');
    } else {
        spotIndicator.classList.remove('ambient-mode');
    }
});

meterButton.addEventListener('click', () => {
    isFrozen = !isFrozen;
    
    if (isFrozen) {
        // Freeze the current readings
        meterButton.classList.add('frozen');
        meterButtonText.textContent = 'Frozen';
        // frozenEV and frozenCombinations will be set in the next analyze loop iteration
    } else {
        // Unfreeze and resume live metering
        meterButton.classList.remove('frozen');
        meterButtonText.textContent = 'Meter';
        frozenEV = null;
        frozenCombinations = [];
    }
});

async function requestCameraAccess() {
    try {
        // Lock to portrait orientation if supported
        if (screen.orientation && screen.orientation.lock) {
            try {
                await screen.orientation.lock('portrait-primary');
            } catch (err) {
                console.log('Orientation lock not supported:', err);
            }
        }
        
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment',
                width: { ideal: 1920 },
                height: { ideal: 1080 }
            }
        });

        video.srcObject = stream;
        permissionScreen.classList.add('hidden');
        
        video.addEventListener('loadedmetadata', () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            startMetering();
        });
    } catch (err) {
        console.error('Camera access error:', err);
        alert('Unable to access camera. Please check permissions.');
    }
}

function startMetering() {
    // Set preview canvas size
    previewCanvas.width = 300;
    previewCanvas.height = 300;
    
    function analyze() {
        if (!video.paused && !video.ended) {
            // Always update camera feed and preview
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            updateLivePreview();
            
            // Only calculate and update if not frozen
            if (!isFrozen) {
                let luminance;
                
                if (meteringMode === 'spot') {
                    // Spot metering - sample center area (10% of frame)
                    const spotSize = Math.min(canvas.width, canvas.height) * 0.1;
                    const x = (canvas.width - spotSize) / 2;
                    const y = (canvas.height - spotSize) / 2;
                    
                    const imageData = ctx.getImageData(x, y, spotSize, spotSize);
                    luminance = calculateLuminance(imageData.data);
                } else {
                    // Ambient metering - center-weighted average of entire frame
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    luminance = calculateCenterWeightedLuminance(imageData.data, canvas.width, canvas.height);
                }
                
                // Calculate EV using the luminance
                const currentEV = calculateEV(luminance, currentISO);
                
                // Update display with current readings
                updateDisplay(currentEV);
            } else if (frozenEV === null) {
                // Just froze - capture current state
                let luminance;
                
                if (meteringMode === 'spot') {
                    const spotSize = Math.min(canvas.width, canvas.height) * 0.1;
                    const x = (canvas.width - spotSize) / 2;
                    const y = (canvas.height - spotSize) / 2;
                    const imageData = ctx.getImageData(x, y, spotSize, spotSize);
                    luminance = calculateLuminance(imageData.data);
                } else {
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    luminance = calculateCenterWeightedLuminance(imageData.data, canvas.width, canvas.height);
                }
                
                frozenEV = calculateEV(luminance, currentISO);
                
                // Calculate and store combinations
                const combinations = calculateCombinations(frozenEV);
                frozenCombinations = combinations.combinations;
                frozenSuggestedIndex = combinations.suggestedIndex;
                
                // Update display with frozen values
                updateDisplayWithCombinations(frozenEV, frozenCombinations, frozenSuggestedIndex);
            }
            // else: stay frozen with existing values
        }
        
        animationFrameId = requestAnimationFrame(analyze);
    }
    
    analyze();
}

function updateLivePreview() {
    // Draw the center portion of the video to the preview canvas
    const centerSize = Math.min(canvas.width, canvas.height) * 0.4;
    const x = (canvas.width - centerSize) / 2;
    const y = (canvas.height - centerSize) / 2;
    
    previewCtx.drawImage(
        video,
        x, y, centerSize, centerSize,  // Source rectangle (center of video)
        0, 0, previewCanvas.width, previewCanvas.height  // Destination (entire preview canvas)
    );
}

function calculateLuminance(data) {
    let sum = 0;
    const pixelCount = data.length / 4;
    
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Relative luminance using ITU-R BT.709
        const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        sum += luminance;
    }
    
    return sum / pixelCount;
}

function calculateCenterWeightedLuminance(data, width, height) {
    let weightedSum = 0;
    let totalWeight = 0;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            
            // Calculate luminance
            const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            
            // Calculate distance from center
            const dx = x - centerX;
            const dy = y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Center-weighted: higher weight for center pixels
            // Using Gaussian-like falloff
            const weight = Math.exp(-2 * (distance / maxDistance) * (distance / maxDistance));
            
            weightedSum += luminance * weight;
            totalWeight += weight;
        }
    }
    
    return weightedSum / totalWeight;
}

function calculateEV(luminance, iso) {
    // More accurate EV calculation that matches phone camera metering
    // Based on the APEX system (Additive System of Photographic Exposure)
    
    // Normalize luminance from 0-255 to 0-1
    const normalizedLuminance = luminance / 255;
    
    if (normalizedLuminance <= 0.001) return 0;
    
    // Use a calibration constant derived from typical phone camera sensors
    // This has been adjusted to match common phone camera metering
    // The constant K relates scene luminance to EV at ISO 100
    const K = 12.5;
    
    // Calculate Luminance Value (Lv) 
    // Lv represents the brightness of the scene
    const Lv = Math.log2(normalizedLuminance * 255 / K);
    
    // Calculate Sensitivity Value (Sv)
    // Sv = log2(ISO/100)
    const Sv = Math.log2(iso / 100);
    
    // EV at ISO 100 = Lv
    // EV at current ISO = Lv + Sv
    // But we want to display EV100 (standard), so:
    const ev100 = Lv;
    
    // However, for practical use, we adjust for the actual ISO
    // This gives us the actual exposure value we need
    const ev = ev100 + Sv;
    
    // Clamp to reasonable range
    return Math.max(-2, Math.min(20, ev));
}

function calculateCombinations(ev) {
    // Define aperture and shutter speed arrays
    const apertures = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22, 32];
    const shutterSpeeds = [
        { value: 8000, display: '1/8000', seconds: 1/8000 },
        { value: 4000, display: '1/4000', seconds: 1/4000 },
        { value: 2000, display: '1/2000', seconds: 1/2000 },
        { value: 1000, display: '1/1000', seconds: 1/1000 },
        { value: 500, display: '1/500', seconds: 1/500 },
        { value: 250, display: '1/250', seconds: 1/250 },
        { value: 125, display: '1/125', seconds: 1/125 },
        { value: 60, display: '1/60', seconds: 1/60 },
        { value: 30, display: '1/30', seconds: 1/30 },
        { value: 15, display: '1/15', seconds: 1/15 },
        { value: 8, display: '1/8', seconds: 1/8 },
        { value: 4, display: '1/4', seconds: 1/4 },
        { value: 2, display: '1/2', seconds: 1/2 },
        { value: 1, display: '1"', seconds: 1 },
        { value: 0.5, display: '2"', seconds: 2 },
        { value: 0.25, display: '4"', seconds: 4 },
        { value: 0.125, display: '8"', seconds: 8 },
    ];
    
    // Generate all valid exposure combinations for the current EV
    const combinations = [];
    
    for (let aperture of apertures) {
        // Calculate required shutter time for this aperture
        // EV = log2(N²/t) => t = N²/2^EV
        const requiredShutterTime = Math.pow(aperture, 2) / Math.pow(2, ev);
        
        // Find the closest standard shutter speed
        let closestShutter = shutterSpeeds[0];
        let minDiff = Math.abs(requiredShutterTime - shutterSpeeds[0].seconds);
        
        for (let shutter of shutterSpeeds) {
            const diff = Math.abs(requiredShutterTime - shutter.seconds);
            if (diff < minDiff) {
                minDiff = diff;
                closestShutter = shutter;
            }
        }
        
        // Only include if the shutter speed is within reasonable bounds
        if (closestShutter.seconds >= 1/8000 && closestShutter.seconds <= 8) {
            combinations.push({
                aperture: aperture,
                shutter: closestShutter,
                diff: minDiff
            });
        }
    }
    
    // Calculate suggested index (middle aperture)
    const suggestedIndex = Math.floor(combinations.length / 2);
    
    return { combinations, suggestedIndex };
}

function updateDisplay(ev) {
    evValue.textContent = ev.toFixed(1);
    
    const result = calculateCombinations(ev);
    const combinations = result.combinations;
    const suggestedIndex = result.suggestedIndex;
    
    // Update the suggested settings in the panel
    if (combinations.length > 0 && suggestedIndex < combinations.length) {
        const suggested = combinations[suggestedIndex];
        apertureValue.textContent = `f/${suggested.aperture}`;
        shutterValue.textContent = suggested.shutter.display;
    }
    
    // Render combination sidebar
    renderCombinations(combinations, suggestedIndex);
}

function updateDisplayWithCombinations(ev, combinations, suggestedIndex) {
    evValue.textContent = ev.toFixed(1);
    
    // Update the suggested settings in the panel
    if (combinations.length > 0 && suggestedIndex < combinations.length) {
        const suggested = combinations[suggestedIndex];
        apertureValue.textContent = `f/${suggested.aperture}`;
        shutterValue.textContent = suggested.shutter.display;
    }
    
    // Render combination sidebar
    renderCombinations(combinations, suggestedIndex);
}

function renderCombinations(combinations, suggestedIndex) {
    exposureSidebar.innerHTML = '';
    
    if (combinations.length === 0) {
        return;
    }
    
    // Show only 5 combinations: 2 before, suggested, 2 after
    const start = Math.max(0, suggestedIndex - 2);
    const end = Math.min(combinations.length, start + 5);
    const visibleCombos = combinations.slice(start, end);
    const adjustedSuggestedIndex = suggestedIndex - start;
    
    visibleCombos.forEach((combo, index) => {
        const item = document.createElement('div');
        item.className = 'combination-item';
        if (index === adjustedSuggestedIndex) {
            item.classList.add('suggested');
        }
        
        item.innerHTML = `
            <div class="combination-aperture">f/${combo.aperture}</div>
            <div class="combination-shutter">${combo.shutter.display}</div>
        `;
        
        exposureSidebar.appendChild(item);
    });
}

// Check if camera is already available
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Auto-request on load could be intrusive, keep manual button
} else {
    permissionScreen.querySelector('.permission-text').textContent = 
        'Your browser does not support camera access. Please use a modern mobile browser.';
    permissionScreen.querySelector('.btn-primary').style.display = 'none';
}

// Offline detection
const offlineIndicator = document.getElementById('offline-indicator');

function updateOnlineStatus() {
    if (!navigator.onLine) {
        offlineIndicator.classList.add('show');
    } else {
        offlineIndicator.classList.remove('show');
    }
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// Check initial status
updateOnlineStatus();
