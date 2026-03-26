const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');

// ─── Configuration ───────────────────────────────────────────────
const HTTP_PORT = parseInt(process.env.PORT) || 3000;

// Data source: 'serial' or 'blynk'
const DATA_SOURCE = (process.env.DATA_SOURCE || 'serial').toLowerCase();

// Serial config (only used when DATA_SOURCE=serial)
const SERIAL_PORT = process.env.SERIAL_PORT || 'COM4';
const BAUD_RATE = parseInt(process.env.BAUD_RATE) || 115200;

// Blynk config (only used when DATA_SOURCE=blynk)
const BLYNK_AUTH_TOKEN = process.env.BLYNK_AUTH_TOKEN || '';
const BLYNK_SERVER = process.env.BLYNK_SERVER || 'blynk.cloud';
const BLYNK_TEMP_PIN = process.env.BLYNK_TEMP_PIN || 'V0';
const BLYNK_MOISTURE_PIN = process.env.BLYNK_MOISTURE_PIN || ''; // empty = no moisture pin yet
const BLYNK_N_PIN = process.env.BLYNK_N_PIN || '';
const BLYNK_P_PIN = process.env.BLYNK_P_PIN || '';
const BLYNK_K_PIN = process.env.BLYNK_K_PIN || '';
const BLYNK_PH_PIN = process.env.BLYNK_PH_PIN || '';
const BLYNK_POLL_INTERVAL = parseInt(process.env.BLYNK_POLL_INTERVAL) || 2000;

// ─── MIME types for static file serving ──────────────────────────
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
};

// ─── HTTP server (serves the UI files) ──────────────────────────
const server = http.createServer((req, res) => {
    let filePath = req.url === '/' ? '/index.html' : req.url;
    filePath = path.join(__dirname, filePath);

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('Not found');
            return;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

// ─── WebSocket server ───────────────────────────────────────────
const wss = new WebSocketServer({ server });
let latestData = { temperature: null, moisture: null, N: null, P: null, K: null, ph: null, timestamp: null };
let sourceConnected = false;

wss.on('connection', (ws) => {
    console.log('🌐 Browser client connected');

    // Send the latest data immediately on connect
    if (latestData.temperature !== null) {
        ws.send(JSON.stringify({ type: 'sensor_data', ...latestData }));
    }

    ws.send(JSON.stringify({
        type: 'status',
        connected: sourceConnected,
        source: DATA_SOURCE,
    }));

    ws.on('close', () => {
        console.log('🌐 Browser client disconnected');
    });
});

function broadcast(data) {
    const message = JSON.stringify(data);
    wss.clients.forEach(client => {
        if (client.readyState === 1) { // WebSocket.OPEN
            client.send(message);
        }
    });
}

// ═══════════════════════════════════════════════════════════════════
//  DATA SOURCE: BLYNK CLOUD HTTP API
// ═══════════════════════════════════════════════════════════════════

function blynkGetPin(pin) {
    return new Promise((resolve, reject) => {
        const url = `https://${BLYNK_SERVER}/external/api/get?token=${BLYNK_AUTH_TOKEN}&${pin}`;
        https.get(url, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                if (res.statusCode !== 200) {
                    reject(new Error(`Blynk API ${res.statusCode}: ${body}`));
                    return;
                }
                // Blynk returns the value as plain text or JSON array
                try {
                    const parsed = JSON.parse(body);
                    // Could be a JSON array like ["25.3"] or a bare number
                    const value = Array.isArray(parsed) ? parseFloat(parsed[0]) : parseFloat(parsed);
                    resolve(value);
                } catch {
                    // Plain text response
                    const value = parseFloat(body.trim());
                    resolve(value);
                }
            });
        }).on('error', reject);
    });
}

let blynkPollTimer = null;

async function pollBlynk() {
    try {
        // Fetch temperature
        let temperature = null;
        if (BLYNK_TEMP_PIN) {
            temperature = await blynkGetPin(BLYNK_TEMP_PIN);
            if (isNaN(temperature)) temperature = null;
        }

        // Fetch moisture
        let moisture = null;
        if (BLYNK_MOISTURE_PIN) {
            moisture = await blynkGetPin(BLYNK_MOISTURE_PIN);
            if (isNaN(moisture)) moisture = null;
        }

        // Fetch NPK and pH
        let N = null, P = null, K = null, ph = null;
        if (BLYNK_N_PIN) { N = await blynkGetPin(BLYNK_N_PIN); if (isNaN(N)) N = null; }
        if (BLYNK_P_PIN) { P = await blynkGetPin(BLYNK_P_PIN); if (isNaN(P)) P = null; }
        if (BLYNK_K_PIN) { K = await blynkGetPin(BLYNK_K_PIN); if (isNaN(K)) K = null; }
        if (BLYNK_PH_PIN) { ph = await blynkGetPin(BLYNK_PH_PIN); if (isNaN(ph)) ph = null; }

        // Mark as connected on successful fetch
        if (!sourceConnected) {
            sourceConnected = true;
            broadcast({ type: 'status', connected: true, source: 'blynk' });
        }

        // Only broadcast if we got at least one valid value
        if (temperature !== null || moisture !== null || N !== null || P !== null || K !== null || ph !== null) {
            latestData = {
                temperature,
                moisture,
                N, P, K, ph,
                timestamp: Date.now(),
            };
            console.log(`☁️  Blynk → Temp: ${latestData.temperature}°C  |  Moisture: ${latestData.moisture ?? 'N/A'}% | NPK: ${N||'-'}/${P||'-'}/${K||'-'} | pH: ${ph||'-'}`);
            broadcast({ type: 'sensor_data', ...latestData });
        }
    } catch (err) {
        console.error(`❌ Blynk poll error: ${err.message}`);
        if (sourceConnected) {
            sourceConnected = false;
            broadcast({ type: 'status', connected: false, source: 'blynk' });
        }
    }

    // Schedule next poll
    blynkPollTimer = setTimeout(pollBlynk, BLYNK_POLL_INTERVAL);
}

function connectBlynk() {
    if (!BLYNK_AUTH_TOKEN) {
        console.error('❌ BLYNK_AUTH_TOKEN is required when DATA_SOURCE=blynk');
        console.error('   Set it via: set BLYNK_AUTH_TOKEN=your_token_here');
        process.exit(1);
    }

    console.log(`☁️  Blynk Cloud mode`);
    console.log(`   Server:       ${BLYNK_SERVER}`);
    console.log(`   Temp pin:     ${BLYNK_TEMP_PIN}`);
    console.log(`   Moisture pin: ${BLYNK_MOISTURE_PIN || '(not configured)'}`);
    console.log(`   Poll interval: ${BLYNK_POLL_INTERVAL}ms\n`);

    pollBlynk();
}

// ═══════════════════════════════════════════════════════════════════
//  DATA SOURCE: SERIAL PORT
// ═══════════════════════════════════════════════════════════════════

let port = null;

function connectSerial() {
    // Dynamically require serialport only when needed
    const { SerialPort } = require('serialport');
    const { ReadlineParser } = require('@serialport/parser-readline');

    console.log(`📡 Attempting to open serial port ${SERIAL_PORT} at ${BAUD_RATE} baud...`);

    port = new SerialPort({
        path: SERIAL_PORT,
        baudRate: BAUD_RATE,
        autoOpen: false,
    });

    const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

    port.open((err) => {
        if (err) {
            console.error(`❌ Serial port error: ${err.message}`);
            console.log('   Retrying in 5 seconds...');
            sourceConnected = false;
            broadcast({ type: 'status', connected: false, source: 'serial' });
            setTimeout(connectSerial, 5000);
            return;
        }

        console.log(`✅ Serial port ${SERIAL_PORT} opened successfully`);
        sourceConnected = true;
        broadcast({ type: 'status', connected: true, source: 'serial' });
    });

    // ─── Parse incoming serial data ─────────────────────────────
    parser.on('data', (line) => {
        const trimmed = line.trim();
        if (!trimmed) return;

        let temperature = null;
        let moisture = null;
        let N = null;
        let P = null;
        let K = null;
        let ph = null;

        // Try JSON format first
        if (trimmed.startsWith('{')) {
            try {
                const json = JSON.parse(trimmed);
                temperature = parseFloat(json.temperature ?? json.temp ?? json.t);
                moisture = parseFloat(json.moisture ?? json.moist ?? json.m);
                N = parseFloat(json.n ?? json.N ?? json.nitrogen);
                P = parseFloat(json.p ?? json.P ?? json.phosphorus);
                K = parseFloat(json.k ?? json.K ?? json.potassium);
                ph = parseFloat(json.ph ?? json.pH);
            } catch (e) {
                // Not valid JSON, fall through
            }
        }

        // Try key:value format  →  TEMP:25.3,MOISTURE:47,N:120,PH:6.5
        if (temperature === null || moisture === null) {
            const tempMatch = trimmed.match(/(?:TEMP|T)\s*:\s*([-\d.]+)/i);
            const moistMatch = trimmed.match(/(?:MOISTURE|MOIST|M)\s*:\s*([-\d.]+)/i);
            const nMatch = trimmed.match(/(?:NITROGEN|N)\s*:\s*([-\d.]+)/i);
            const pMatch = trimmed.match(/(?:PHOSPHORUS|P)\s*:\s*([-\d.]+)/i);
            const kMatch = trimmed.match(/(?:POTASSIUM|K)\s*:\s*([-\d.]+)/i);
            const phMatch = trimmed.match(/(?:PH)\s*:\s*([-\d.]+)/i);

            if (tempMatch) temperature = parseFloat(tempMatch[1]);
            if (moistMatch) moisture = parseFloat(moistMatch[1]);
            if (nMatch) N = parseFloat(nMatch[1]);
            if (pMatch) P = parseFloat(pMatch[1]);
            if (kMatch) K = parseFloat(kMatch[1]);
            if (phMatch) ph = parseFloat(phMatch[1]);
        }

        // Try simple CSV:  25.3,47,120,40,40,6.5 (Temp, Moisture, N, P, K, pH)
        if (temperature === null && moisture === null) {
            const parts = trimmed.split(',').map(s => parseFloat(s.trim()));
            if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                temperature = parts[0];
                moisture = parts[1];
                if (parts.length >= 6) {
                    N = parts[2]; P = parts[3]; K = parts[4]; ph = parts[5];
                }
            }
        }

        // Only broadcast if we got at least one valid value
        if (temperature !== null || moisture !== null || N !== null || P !== null || K !== null || ph !== null) {
            latestData = {
                temperature: isNaN(temperature) ? null : temperature,
                moisture: isNaN(moisture) ? null : moisture,
                N: isNaN(N) ? null : N,
                P: isNaN(P) ? null : P,
                K: isNaN(K) ? null : K,
                ph: isNaN(ph) ? null : ph,
                timestamp: Date.now(),
            };
            console.log(`📊 Temp: ${latestData.temperature}°C | Moist: ${latestData.moisture}% | NPK: ${N||'-'}/${P||'-'}/${K||'-'} | pH: ${ph||'-'}`);
            broadcast({ type: 'sensor_data', ...latestData });
        }
    });

    port.on('close', () => {
        console.log('⚠️  Serial port closed. Reconnecting in 5 seconds...');
        sourceConnected = false;
        broadcast({ type: 'status', connected: false, source: 'serial' });
        setTimeout(connectSerial, 5000);
    });

    port.on('error', (err) => {
        console.error(`❌ Serial error: ${err.message}`);
    });
}

// ─── Start everything ───────────────────────────────────────────
server.listen(HTTP_PORT, () => {
    console.log(`\n🌱 AgroAI Sensor Bridge`);
    console.log(`   UI:          http://localhost:${HTTP_PORT}`);
    console.log(`   Data source: ${DATA_SOURCE.toUpperCase()}\n`);

    if (DATA_SOURCE === 'blynk') {
        connectBlynk();
    } else {
        console.log(`   Serial: ${SERIAL_PORT} @ ${BAUD_RATE} baud\n`);
        connectSerial();
    }
});
