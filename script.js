const tempInput = document.getElementById('temp-input');
const moistureInput = document.getElementById('moisture-input');

const analyzeBtn = document.getElementById('analyze-btn');
const btnText = document.querySelector('.btn-text');
const loader = document.querySelector('.loader-spinner');
const resultBox = document.getElementById('result-box');
const cropImg = document.getElementById('crop-img');
const cropName = document.getElementById('crop-name');
const cropDesc = document.getElementById('crop-desc');

const sensorStatus = document.getElementById('sensor-status');
const statusText = sensorStatus.querySelector('.status-text');

// Theme & Tabs
const themeToggleBtn = document.getElementById('theme-toggle');
const tabRover = document.getElementById('tab-rover');
const tabManual = document.getElementById('tab-manual');
const roverView = document.getElementById('rover-view');
const manualView = document.getElementById('manual-view');

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.querySelector('.moon-icon').classList.toggle('hidden');
    document.querySelector('.sun-icon').classList.toggle('hidden');
});

tabRover.addEventListener('click', () => {
    tabRover.classList.add('active'); tabManual.classList.remove('active');
    roverView.classList.remove('hidden'); manualView.classList.add('hidden');
    isLiveMode = true; enableLiveMode();
});

tabManual.addEventListener('click', () => {
    tabManual.classList.add('active'); tabRover.classList.remove('active');
    manualView.classList.remove('hidden'); roverView.classList.add('hidden');
    isLiveMode = false; disableLiveMode();
});

// ─── i18n Translation System ────────────────────────────────────
const langSelect = document.getElementById('lang-select');
let currentLang = localStorage.getItem('agroai-lang') || 'en';
langSelect.value = currentLang;

const translations = {
    en: {
        title: 'Crop Recommendation',
        subtitle: 'Enter the environmental parameters below to get AI-driven crop suggestions tailored for your soil.',
        temperature: 'Temperature',
        soilMoisture: 'Soil Moisture',
        generateBtn: 'Generate Recommendation',
        autoAnalyzing: 'Auto-Analyzing...',
        recommendedCrop: 'Recommended Crop',
        match: 'Match',
        sensorLive: 'Sensor Live',
        sensorOffline: 'Sensor Offline',
        connecting: 'Connecting...',
        live: 'Live',
        crops: {
            Rice: { name: 'Rice', desc: 'Thrives in high moisture and warm to hot temperatures. The current soil conditions are perfect for a paddy field setup.' },
            Wheat: { name: 'Wheat', desc: 'Ideal for moderate temperatures and moderate moisture. Excellent choice for current conditions ensuring high grain quality.' },
            Maize: { name: 'Maize', desc: 'Versatile crop suited for warm conditions with balanced moisture levels. Requires good drainage.' },
            Barley: { name: 'Barley', desc: 'Highly resilient and requires relatively lower moisture. Great for the current cooler and drier environment.' }
        }
    },
    hi: {
        title: 'फसल सिफारिश',
        subtitle: 'अपनी मिट्टी के लिए AI-आधारित फसल सुझाव प्राप्त करने के लिए नीचे पर्यावरणीय मापदंड दर्ज करें।',
        temperature: 'तापमान',
        soilMoisture: 'मिट्टी की नमी',
        generateBtn: 'सिफारिश प्राप्त करें',
        autoAnalyzing: 'स्वचालित विश्लेषण...',
        recommendedCrop: 'अनुशंसित फसल',
        match: 'मिलान',
        sensorLive: 'सेंसर चालू',
        sensorOffline: 'सेंसर बंद',
        connecting: 'कनेक्ट हो रहा है...',
        live: 'लाइव',
        crops: {
            Rice: { name: 'चावल', desc: 'उच्च नमी और गर्म तापमान में उगने के लिए उत्तम। वर्तमान मिट्टी की स्थिति धान की खेती के लिए एकदम सही है।' },
            Wheat: { name: 'गेहूँ', desc: 'मध्यम तापमान और नमी के लिए आदर्श। उच्च अनाज गुणवत्ता सुनिश्चित करने के लिए उत्कृष्ट विकल्प।' },
            Maize: { name: 'मक्का', desc: 'गर्म परिस्थितियों और संतुलित नमी के लिए उपयुक्त बहुमुखी फसल। अच्छी जल निकासी आवश्यक है।' },
            Barley: { name: 'जौ', desc: 'अत्यधिक लचीला और कम नमी की आवश्यकता। वर्तमान ठंडे और सूखे वातावरण के लिए बढ़िया।' }
        }
    },
    ta: {
        title: 'பயிர் பரிந்துரை',
        subtitle: 'உங்கள் மண்ணுக்கான AI சார்ந்த பயிர் பரிந்துரைகளைப் பெற கீழே சுற்றுச்சூழல் அளவுருக்களை உள்ளிடவும்.',
        temperature: 'வெப்பநிலை',
        soilMoisture: 'மண் ஈரப்பதம்',
        generateBtn: 'பரிந்துரையை உருவாக்கு',
        autoAnalyzing: 'தானியங்கி பகுப்பாய்வு...',
        recommendedCrop: 'பரிந்துரைக்கப்பட்ட பயிர்',
        match: 'பொருத்தம்',
        sensorLive: 'சென்சார் இயங்குகிறது',
        sensorOffline: 'சென்சார் இணைப்பு இல்லை',
        connecting: 'இணைக்கிறது...',
        live: 'நேரடி',
        crops: {
            Rice: { name: 'நெல்', desc: 'அதிக ஈரப்பதம் மற்றும் சூடான வெப்பநிலையில் வளரும். தற்போதைய மண் நிலை நெற்பயிருக்கு மிகவும் ஏற்றது.' },
            Wheat: { name: 'கோதுமை', desc: 'மிதமான வெப்பநிலை மற்றும் ஈரப்பதத்திற்கு ஏற்றது. உயர் தானிய தரத்தை உறுதி செய்யும் சிறந்த தேர்வு.' },
            Maize: { name: 'மக்காச்சோளம்', desc: 'சூடான நிலைகள் மற்றும் சமநிலை ஈரப்பதத்திற்கு ஏற்ற பல்துறை பயிர்.' },
            Barley: { name: 'பார்லி', desc: 'மிகவும் நெகிழ்வானது, குறைந்த ஈரப்பதம் தேவை. குளிர்ந்த சூழலுக்கு சிறந்தது.' }
        }
    },
    te: {
        title: 'పంట సిఫార్సు',
        subtitle: 'మీ నేలకు AI ఆధారిత పంట సూచనలను పొందడానికి క్రింద పర్యావరణ పారామీటర్లను నమోదు చేయండి.',
        temperature: 'ఉష్ణోగ్రత',
        soilMoisture: 'నేల తేమ',
        generateBtn: 'సిఫార్సు పొందండి',
        autoAnalyzing: 'స్వయంచాలక విశ్లేషణ...',
        recommendedCrop: 'సిఫార్సు చేసిన పంట',
        match: 'సరిపోలిక',
        sensorLive: 'సెన్సార్ ఆన్',
        sensorOffline: 'సెన్సార్ ఆఫ్‌లైన్',
        connecting: 'కనెక్ట్ అవుతోంది...',
        live: 'లైవ్',
        crops: {
            Rice: { name: 'వరి', desc: 'అధిక తేమ మరియు వెచ్చని ఉష్ణోగ్రతలలో బాగా పెరుగుతుంది. ప్రస్తుత నేల పరిస్థితులు వరి సాగుకు అనువైనవి.' },
            Wheat: { name: 'గోధుమ', desc: 'మితమైన ఉష్ణోగ్రతలు మరియు తేమకు అనువైనది. అధిక ధాన్యం నాణ్యతను నిర్ధారించే అద్భుతమైన ఎంపిక.' },
            Maize: { name: 'మొక్కజొన్న', desc: 'వెచ్చని పరిస్థితులు మరియు సమతుల్య తేమ స్థాయిలకు అనువైన బహుముఖ పంట.' },
            Barley: { name: 'బార్లీ', desc: 'అత్యంత స్థితిస్థాపకం మరియు తక్కువ తేమ అవసరం. చల్లని వాతావరణానికి చాలా బాగుంది.' }
        }
    },
    kn: {
        title: 'ಬೆಳೆ ಶಿಫಾರಸು',
        subtitle: 'ನಿಮ್ಮ ಮಣ್ಣಿಗೆ AI ಆಧಾರಿತ ಬೆಳೆ ಸಲಹೆಗಳನ್ನು ಪಡೆಯಲು ಕೆಳಗಿನ ಪರಿಸರ ನಿಯತಾಂಕಗಳನ್ನು ನಮೂದಿಸಿ.',
        temperature: 'ತಾಪಮಾನ',
        soilMoisture: 'ಮಣ್ಣಿನ ತೇವಾಂಶ',
        generateBtn: 'ಶಿಫಾರಸು ಪಡೆಯಿರಿ',
        autoAnalyzing: 'ಸ್ವಯಂ ವಿಶ್ಲೇಷಣೆ...',
        recommendedCrop: 'ಶಿಫಾರಸು ಮಾಡಿದ ಬೆಳೆ',
        match: 'ಹೊಂದಾಣಿಕೆ',
        sensorLive: 'ಸೆನ್ಸಾರ್ ಆನ್',
        sensorOffline: 'ಸೆನ್ಸಾರ್ ಆಫ್‌ಲೈನ್',
        connecting: 'ಸಂಪರ್ಕಿಸುತ್ತಿದೆ...',
        live: 'ಲೈವ್',
        crops: {
            Rice: { name: 'ಭತ್ತ', desc: 'ಹೆಚ್ಚಿನ ತೇವಾಂಶ ಮತ್ತು ಬಿಸಿ ತಾಪಮಾನದಲ್ಲಿ ಚೆನ್ನಾಗಿ ಬೆಳೆಯುತ್ತದೆ. ಪ್ರಸ್ತುತ ಮಣ್ಣಿನ ಸ್ಥಿತಿ ಭತ್ತಕ್ಕೆ ಸೂಕ್ತ.' },
            Wheat: { name: 'ಗೋಧಿ', desc: 'ಮಧ್ಯಮ ತಾಪಮಾನ ಮತ್ತು ತೇವಾಂಶಕ್ಕೆ ಸೂಕ್ತ. ಉತ್ತಮ ಧಾನ್ಯ ಗುಣಮಟ್ಟವನ್ನು ಖಚಿತಪಡಿಸುತ್ತದೆ.' },
            Maize: { name: 'ಜೋಳ', desc: 'ಬಿಸಿ ಪರಿಸ್ಥಿತಿಗಳು ಮತ್ತು ಸಮತೋಲಿತ ತೇವಾಂಶಕ್ಕೆ ಸೂಕ್ತ. ಒಳ್ಳೆಯ ಒಳಚರಂಡಿ ಅಗತ್ಯ.' },
            Barley: { name: 'ಬಾರ್ಲಿ', desc: 'ಹೆಚ್ಚು ಸ್ಥಿತಿಸ್ಥಾಪಕ ಮತ್ತು ಕಡಿಮೆ ತೇವಾಂಶ ಅಗತ್ಯ. ತಂಪು ವಾತಾವರಣಕ್ಕೆ ಉತ್ತಮ.' }
        }
    },
    mr: {
        title: 'पीक शिफारस',
        subtitle: 'तुमच्या जमिनीसाठी AI-आधारित पीक सूचना मिळवण्यासाठी खालील पर्यावरणीय मापदंड प्रविष्ट करा.',
        temperature: 'तापमान',
        soilMoisture: 'जमिनीतील ओलावा',
        generateBtn: 'शिफारस मिळवा',
        autoAnalyzing: 'स्वयंचालित विश्लेषण...',
        recommendedCrop: 'शिफारस केलेले पीक',
        match: 'जुळणी',
        sensorLive: 'सेन्सॉर चालू',
        sensorOffline: 'सेन्सॉर बंद',
        connecting: 'कनेक्ट होत आहे...',
        live: 'लाइव्ह',
        crops: {
            Rice: { name: 'तांदूळ', desc: 'उच्च ओलावा आणि उबदार तापमानात उत्तम वाढतो. सध्याची माती भात शेतीसाठी योग्य आहे.' },
            Wheat: { name: 'गहू', desc: 'मध्यम तापमान आणि ओलाव्यासाठी आदर्श. उच्च दर्जाच्या धान्यासाठी उत्कृष्ट निवड.' },
            Maize: { name: 'मका', desc: 'उबदार परिस्थिती आणि संतुलित ओलाव्यासाठी योग्य बहुमुखी पीक.' },
            Barley: { name: 'जव', desc: 'अत्यंत लवचिक आणि कमी ओलाव्याची आवश्यकता. थंड वातावरणासाठी उत्तम.' }
        }
    },
    pa: {
        title: 'ਫ਼ਸਲ ਦੀ ਸਿਫ਼ਾਰਸ਼',
        subtitle: 'ਆਪਣੀ ਮਿੱਟੀ ਲਈ AI-ਅਧਾਰਿਤ ਫ਼ਸਲ ਦੇ ਸੁਝਾਅ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਹੇਠਾਂ ਵਾਤਾਵਰਣ ਸੰਬੰਧੀ ਮਾਪਦੰਡ ਦਰਜ ਕਰੋ।',
        temperature: 'ਤਾਪਮਾਨ',
        soilMoisture: 'ਮਿੱਟੀ ਦੀ ਨਮੀ',
        generateBtn: 'ਸਿਫ਼ਾਰਸ਼ ਪ੍ਰਾਪਤ ਕਰੋ',
        autoAnalyzing: 'ਸਵੈਚਲਿਤ ਵਿਸ਼ਲੇਸ਼ਣ...',
        recommendedCrop: 'ਸਿਫ਼ਾਰਸ਼ ਕੀਤੀ ਫ਼ਸਲ',
        match: 'ਮੇਲ',
        sensorLive: 'ਸੈਂਸਰ ਚਾਲੂ',
        sensorOffline: 'ਸੈਂਸਰ ਔਫਲਾਈਨ',
        connecting: 'ਕਨੈਕਟ ਹੋ ਰਿਹਾ ਹੈ...',
        live: 'ਲਾਈਵ',
        crops: {
            Rice: { name: 'ਝੋਨਾ', desc: 'ਉੱਚ ਨਮੀ ਅਤੇ ਗਰਮ ਤਾਪਮਾਨ ਵਿੱਚ ਵਧੀਆ ਹੁੰਦਾ ਹੈ। ਮੌਜੂਦਾ ਮਿੱਟੀ ਝੋਨੇ ਲਈ ਬਹੁਤ ਵਧੀਆ ਹੈ।' },
            Wheat: { name: 'ਕਣਕ', desc: 'ਦਰਮਿਆਨੇ ਤਾਪਮਾਨ ਅਤੇ ਨਮੀ ਲਈ ਆਦਰਸ਼। ਉੱਚ ਗੁਣਵੱਤਾ ਦੀ ਪੈਦਾਵਾਰ ਲਈ ਵਧੀਆ।' },
            Maize: { name: 'ਮੱਕੀ', desc: 'ਗਰਮ ਹਾਲਾਤਾਂ ਅਤੇ ਸੰਤੁਲਿਤ ਨਮੀ ਲਈ ਢੁਕਵੀਂ ਬਹੁਮੁਖੀ ਫ਼ਸਲ।' },
            Barley: { name: 'ਜੌਂ', desc: 'ਬਹੁਤ ਲਚਕੀਲਾ ਅਤੇ ਘੱਟ ਨਮੀ ਦੀ ਲੋੜ ਹੈ। ਠੰਡੇ ਮੌਸਮ ਲਈ ਵਧੀਆ।' }
        }
    }
};

// Apply translations to all data-i18n elements
function applyTranslations(lang) {
    const t = translations[lang] || translations.en;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            el.textContent = t[key];
        }
    });
    // Update font family for Indian scripts
    if (['hi', 'mr'].includes(lang)) {
        document.body.style.fontFamily = "'Noto Sans Devanagari', 'Outfit', sans-serif";
    } else if (lang === 'ta') {
        document.body.style.fontFamily = "'Noto Sans Tamil', 'Outfit', sans-serif";
    } else if (lang === 'te') {
        document.body.style.fontFamily = "'Noto Sans Telugu', 'Outfit', sans-serif";
    } else if (lang === 'kn') {
        document.body.style.fontFamily = "'Noto Sans Kannada', 'Outfit', sans-serif";
    } else if (lang === 'bn') {
        document.body.style.fontFamily = "'Noto Sans Bengali', 'Outfit', sans-serif";
    } else if (lang === 'pa') {
        document.body.style.fontFamily = "'Noto Sans Gurmukhi', 'Outfit', sans-serif";
    } else {
        document.body.style.fontFamily = "'Outfit', sans-serif";
    }
}

function t(key) {
    return (translations[currentLang] || translations.en)[key] || translations.en[key] || key;
}

function getCropTranslation(cropNameEn) {
    const lang = translations[currentLang] || translations.en;
    return lang.crops[cropNameEn] || translations.en.crops[cropNameEn];
}

// Language change handler
langSelect.addEventListener('change', (e) => {
    currentLang = e.target.value;
    localStorage.setItem('agroai-lang', currentLang);
    applyTranslations(currentLang);
});

// Apply saved language on load
applyTranslations(currentLang);

// Initialize Web Worker for low-latency background processing
const aiWorker = new Worker('worker.js');

// ─── AI Worker Response Handler ─────────────────────────────────
aiWorker.onmessage = function(e) {
    const recommendedCrop = e.data;
    
    // Fallback translation if crop isn't in dictionary yet
    let cropT = getCropTranslation(recommendedCrop.name);
    if (!cropT) {
        cropT = {
            name: recommendedCrop.name,
            desc: `Optimal for current readings. High yield probability based on granular ML analysis.`
        };
    }

    cropName.textContent = cropT.name;
    cropDesc.textContent = cropT.desc;
    
    // Set image with fallback via error event handler
    cropImg.src = `${recommendedCrop.id}.png`;
    cropImg.onerror = () => { cropImg.src = 'wheat.png'; }; // fallback image

    document.querySelector('.conf-value').textContent = recommendedCrop.confidence;

    // Reset button
    btnText.style.display = 'block';
    loader.style.display = 'none';
    analyzeBtn.style.pointerEvents = 'auto';

    // Show result
    const emptyState = document.getElementById('empty-state');
    if (emptyState) {
        emptyState.classList.remove('show');
        emptyState.classList.add('hidden');
    }
    
    resultBox.classList.remove('hidden');
    setTimeout(() => {
        resultBox.classList.add('show');
    }, 50);
};


// ─── Live Mode State ────────────────────────────────────────────
let isLiveMode = true; // Default tab is rover
let ws = null;
let wsReconnectTimer = null;
let autoAnalyzeTimer = null;
let sensorConnected = false;
let dataSource = 'serial'; 
let latestSensorData = null;

// ─── Slider event listeners (Removed for inputs) ─────────────────
// (Inputs don't need track coloring like sliders did)

// ─── Analyze / Recommend ────────────────────────────────────────
let loadingTimeout = null;

function triggerAnalysis() {
    // UI state: loading
    btnText.style.display = 'none';
    loader.style.display = 'block';
    analyzeBtn.style.pointerEvents = 'none';
    
    // If it's the first run, ensure empty state is fading out
    const emptyState = document.getElementById('empty-state');
    if (emptyState && !resultBox.classList.contains('show')) {
        emptyState.classList.remove('show');
        setTimeout(() => emptyState.classList.add('hidden'), 300);
    }

    resultBox.classList.remove('show');

    let temp, moisture, N, P, K, ph;

    if (isLiveMode && latestSensorData) {
        temp = latestSensorData.temperature || 25;
        moisture = latestSensorData.moisture || 40;
        N = latestSensorData.N || 80;
        P = latestSensorData.P || 40;
        K = latestSensorData.K || 40;
        ph = latestSensorData.ph || 6.5;
    } else {
        temp = parseFloat(tempInput.value) || 25;
        moisture = parseFloat(moistureInput.value) || 40;
        N = 80;
        P = 40;
        K = 40;
        ph = 6.5;
    }

    // Send data to Web Worker for low-latency non-blocking processing.
    aiWorker.postMessage({ temp, moisture, N, P, K, ph });
}

analyzeBtn.addEventListener('click', triggerAnalysis);

// ─── WebSocket Connection ───────────────────────────────────────
function connectWebSocket() {
    // Determine WebSocket URL (same host as page, or localhost for file:// protocol)
    const wsHost = (location.protocol === 'file:') ? 'localhost:3000' : location.host;
    const wsUrl = `ws://${wsHost}`;

    ws = new WebSocket(wsUrl);

    ws.addEventListener('open', () => {
        console.log('🌐 WebSocket connected');
        updateConnectionStatus('reconnecting'); // connected but waiting for serial status
    });

    ws.addEventListener('message', (event) => {
        try {
            const data = JSON.parse(event.data);
            handleServerMessage(data);
        } catch (e) {
            console.warn('Invalid message from server:', event.data);
        }
    });

    ws.addEventListener('close', () => {
        console.log('🌐 WebSocket disconnected');
        updateConnectionStatus('disconnected');
        // Auto-reconnect after 3 seconds
        if (isLiveMode) {
            wsReconnectTimer = setTimeout(connectWebSocket, 3000);
        }
    });

    ws.addEventListener('error', (err) => {
        console.error('WebSocket error:', err);
        ws.close();
    });
}

function handleServerMessage(data) {
    switch (data.type) {
        case 'status':
            sensorConnected = data.connected;
            if (data.source) dataSource = data.source;
            updateConnectionStatus(data.connected ? 'connected' : 'disconnected');
            break;

        case 'sensor_data':
            if (!isLiveMode) return; 
            
            latestSensorData = data;

            if (data.temperature !== null) document.getElementById('live-temp').textContent = `${Math.round(data.temperature)}°C`;
            if (data.moisture !== null) document.getElementById('live-moist').textContent = `${Math.round(data.moisture)}%`;

            // Auto-trigger recommendation with debounce
            clearTimeout(autoAnalyzeTimer);
            autoAnalyzeTimer = setTimeout(triggerAnalysis, 1000);
            break;
    }
}

// (Elements flash animation omitted for pure stats display)

function updateConnectionStatus(state) {
    sensorStatus.className = `sensor-status ${state}`;
    // Add source-specific class for styling
    if (dataSource === 'blynk') sensorStatus.classList.add('blynk-source');
    else sensorStatus.classList.remove('blynk-source');

    const sourceLabel = dataSource === 'blynk' ? ' (Blynk)' : '';
    switch (state) {
        case 'connected':
            statusText.textContent = t('sensorLive') + sourceLabel;
            break;
        case 'disconnected':
            statusText.textContent = t('sensorOffline');
            break;
        case 'reconnecting':
            statusText.textContent = t('connecting') + sourceLabel;
            break;
    }
}

function enableLiveMode() {
    connectWebSocket();
    btnText.textContent = t('autoAnalyzing');
}

function disableLiveMode() {
    clearTimeout(wsReconnectTimer);
    clearTimeout(autoAnalyzeTimer);
    if (ws) {
        ws.close();
        ws = null;
    }
    updateConnectionStatus('disconnected');
    btnText.textContent = t('generateBtn');
}

// Kickstart if default tab is rover
if (isLiveMode) enableLiveMode();

// ─── Offline PWA ────────────────────────────────────────────────
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('✅ Offline Mode Ready:', reg.scope))
            .catch(err => console.error('❌ SW Failed:', err));
    });
}
