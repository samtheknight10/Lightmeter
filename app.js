let stream = null;
let animationFrameId = null;
let currentISO = 400;

const video = document.getElementById('camera');
const canvas = document.getElementById('analysis-canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const permissionScreen = document.getElementById('permission-screen');
const evValue = document.getElementById('ev-value');
const apertureValue = document.getElementById('aperture-value');
const shutterValue = document.getElementById('shutter-value');
const isoSelector = document.getElementById('iso-selector');

// Set default ISO
isoSelector.value = '400';

isoSelector.addEventListener('change', (e) => {
    currentISO = parseInt(e.target.value);
});

async function requestCameraAccess() {
    try {
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
    function analyze() {
        if (!video.paused && !video.ended) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Spot metering - sample center area (10% of frame)
            const spotSize = Math.min(canvas.width, canvas.height) * 0.1;
            const x = (canvas.width - spotSize) / 2;
            const y = (canvas.height - spotSize) / 2;
            
            const imageData = ctx.getImageData(x, y, spotSize, spotSize);
            const luminance = calculateLuminance(imageData.data);
            
            // Calculate EV using the luminance
            const ev = calculateEV(luminance, currentISO);
            
            // Update display
            updateDisplay(ev);
        }
        
        animationFrameId = requestAnimationFrame(analyze);
    }
    
    analyze();
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

function calculateEV(luminance, iso) {
    // Convert luminance (0-255) to EV
    // This is a simplified calculation
    // EV = log2(luminance * (iso/100) / K) where K is a calibration constant
    
    const K = 12.5; // Calibration constant (adjustable)
    const normalizedLuminance = luminance / 255;
    
    if (normalizedLuminance <= 0) return 0;
    
    const ev = Math.log2((normalizedLuminance * (iso / 100)) / K) + 8;
    
    return Math.max(0, Math.min(20, ev)); // Clamp between 0 and 20
}

function updateDisplay(ev) {
    evValue.textContent = ev.toFixed(1);
    
    // Calculate suggested settings (using Sunny 16 as baseline)
    // At EV 15 (bright sunlight), f/16 @ 1/ISO
    // Each EV stop doubles or halves the light
    
    const apertures = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22];
    const shutterSpeeds = [
        { value: 8000, display: '1/8000' },
        { value: 4000, display: '1/4000' },
        { value: 2000, display: '1/2000' },
        { value: 1000, display: '1/1000' },
        { value: 500, display: '1/500' },
        { value: 250, display: '1/250' },
        { value: 125, display: '1/125' },
        { value: 60, display: '1/60' },
        { value: 30, display: '1/30' },
        { value: 15, display: '1/15' },
        { value: 8, display: '1/8' },
        { value: 4, display: '1/4' },
        { value: 2, display: '1/2' },
        { value: 1, display: '1"' },
        { value: 0.5, display: '2"' },
        { value: 0.25, display: '4"' },
    ];
    
    // Simple suggested exposure: pick middle aperture and calculate shutter
    const suggestedAperture = apertures[4]; // f/5.6
    const apertureStops = Math.log2(Math.pow(suggestedAperture, 2));
    
    // EV = log2(N²/t) where N is f-number and t is shutter time
    // Solving for t: t = N² / 2^EV
    const shutterTime = Math.pow(suggestedAperture, 2) / Math.pow(2, ev);
    
    // Find closest shutter speed
    let closestShutter = shutterSpeeds[0];
    let minDiff = Math.abs(1/shutterTime - shutterSpeeds[0].value);
    
    for (let i = 1; i < shutterSpeeds.length; i++) {
        const diff = Math.abs(1/shutterTime - shutterSpeeds[i].value);
        if (diff < minDiff) {
            minDiff = diff;
            closestShutter = shutterSpeeds[i];
        }
    }
    
    apertureValue.textContent = `f/${suggestedAperture}`;
    shutterValue.textContent = closestShutter.display;
}

// Check if camera is already available
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Auto-request on load could be intrusive, keep manual button
} else {
    permissionScreen.querySelector('.permission-text').textContent = 
        'Your browser does not support camera access. Please use a modern mobile browser.';
    permissionScreen.querySelector('.btn-primary').style.display = 'none';
}
