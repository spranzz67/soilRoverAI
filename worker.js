// ─── AgroAI Web Worker — Advanced Crop Recommendation Logic ──────

// This expanded database simulates an advanced ML model offline backend,
// mapping crops to ideal Nitrogen (N), Phosphorus (P), Potassium (K),
// Temperature, Humidity/Moisture, pH, and Rainfall.
const advancedCropDatabase = [
    { name: 'Rice', id: 'rice', N: [60, 90], P: [35, 60], K: [35, 45], temp: [20, 35], moisture: [75, 100], ph: [5.5, 7.5] },
    { name: 'Wheat', id: 'wheat', N: [50, 80], P: [30, 60], K: [20, 40], temp: [10, 25], moisture: [40, 60], ph: [6.0, 7.5] },
    { name: 'Maize', id: 'maize', N: [80, 110], P: [40, 60], K: [30, 50], temp: [18, 30], moisture: [50, 75], ph: [5.5, 7.0] },
    { name: 'Barley', id: 'barley', N: [40, 60], P: [20, 40], K: [15, 30], temp: [5, 20], moisture: [30, 50], ph: [6.0, 8.0] },
    { name: 'Cotton', id: 'cotton', N: [100, 140], P: [40, 60], K: [40, 60], temp: [21, 30], moisture: [50, 70], ph: [5.8, 8.0] },
    { name: 'Sugarcane', id: 'sugarcane', N: [100, 150], P: [50, 80], K: [40, 60], temp: [20, 35], moisture: [70, 90], ph: [5.5, 7.5] },
    { name: 'Soybean', id: 'soybean', N: [20, 40], P: [40, 60], K: [20, 40], temp: [20, 30], moisture: [50, 70], ph: [6.0, 7.5] }
];

// Feature scales (used to normalize distance calculations)
const SCALES = {
    N: 150, P: 100, K: 100, temp: 50, moisture: 100, ph: 14
};

// Calculate distance based on input vs optimal range (k-NN style distance)
function calculateDistance(val, range, scale) {
    if (val === undefined || val === null) return 0; // Ignore missing features
    
    // If within ideal range, distance is 0
    if (val >= range[0] && val <= range[1]) return 0;
    
    // Distance to nearest bound, normalized
    const minD = Math.abs(val - range[0]);
    const maxD = Math.abs(val - range[1]);
    const dist = Math.min(minD, maxD);
    return dist / scale;
}

self.addEventListener('message', function(e) {
    const input = e.data; // { temp, moisture, N, P, K, ph }
    
    let bestMatch = null;
    let minDistance = Infinity;

    advancedCropDatabase.forEach(crop => {
        let totalDist = 0;
        let featuresCount = 0;
        
        // Sum normalized distances for all provided parameters
        if (input.temp !== undefined) { totalDist += calculateDistance(input.temp, crop.temp, SCALES.temp) * 2; featuresCount+=2; } // higher weight for temp/moisture
        if (input.moisture !== undefined) { totalDist += calculateDistance(input.moisture, crop.moisture, SCALES.moisture) * 2; featuresCount+=2; }
        
        // Support for extra parameters when UI adds them
        if (input.N !== undefined) { totalDist += calculateDistance(input.N, crop.N, SCALES.N); featuresCount++; }
        else { totalDist += 0; featuresCount++; } // fallback
        if (input.P !== undefined) { totalDist += calculateDistance(input.P, crop.P, SCALES.P); featuresCount++; }
        else { totalDist += 0; featuresCount++; }
        if (input.K !== undefined) { totalDist += calculateDistance(input.K, crop.K, SCALES.K); featuresCount++; }
        else { totalDist += 0; featuresCount++; }
        if (input.ph !== undefined) { totalDist += calculateDistance(input.ph, crop.ph, SCALES.ph); featuresCount++; }
        else { totalDist += 0; featuresCount++; }

        const avgDist = totalDist / featuresCount;

        if (avgDist < minDistance) {
            minDistance = avgDist;
            bestMatch = crop;
        }
    });

    // Calculate confidence percentage based on distance (0 distance = 99% confident)
    // A distance of 0.2 means 20% off from ideal parameter bounds.
    let confidenceNum = Math.max(10, 99 - (minDistance * 100 * 2)); // heuristic mapping
    const confidenceStr = Math.round(confidenceNum) + '%';

    // Post result back to main thread instantly
    self.postMessage({
        name: bestMatch.name,
        id: bestMatch.id,
        confidence: confidenceStr
    });
});
