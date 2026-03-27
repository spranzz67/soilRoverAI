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
        srcBlynk: ' (Blynk)',
        navTitle: 'SoilRover AI',
        title: 'Soil Quality Survey Rover AI Crop Recommendation System',
        subtitle: 'Enter the environmental parameters below to get AI-based crop recommendations for your soil.',
        temperature: 'Temperature',
        soilMoisture: 'Soil Moisture',
        generateBtn: 'Get Crop Recommendations',
        autoAnalyzing: 'Auto Analyzing...',
        recommendedCrop: 'Recommended Crop',
        match: 'Match',
        sensorLive: 'Sensor Live',
        sensorOffline: 'Connection Lost - Searching for Bridge...',
        connecting: 'Connecting...',
        live: 'Live',
        aiBadge: 'AI-Based Recommendations',
        statCrops: 'Crops in Database',
        statAccuracy: 'Accuracy Rate',
        statParams: 'Analyzed Parameters',
        tabRover: 'ESP32 Rover',
        tabManual: 'Manual Entry',
        lblRoverTitle: 'ESP32 Soil Rover',
        lblTemp: 'Temperature',
        lblMoist: 'Moisture',
        lblRemoteProbe: 'Remote Probe Control',
        btnFullCycle: 'Full Cycle',
        btnInsert: 'Insert',
        btnRetract: 'Retract',
        lblEnvData: 'Environmental Data',
        emptyState: 'Enter your soil and climate data on the left to see AI optimization targets',
        crops: {
            Rice: { name: 'Rice', desc: 'Grows best in high moisture and warm temperatures. Current soil condition is perfect for paddy cultivation.' },
            Wheat: { name: 'Wheat', desc: 'Ideal for moderate temperatures and moisture. Excellent choice ensuring high grain quality.' },
            Maize: { name: 'Maize', desc: 'Versatile crop suited for warm conditions and balanced moisture levels. Good drainage essential.' },
            Barley: { name: 'Barley', desc: 'Highly resilient and requires lower moisture. Great for the current cooler and drier environment.' },
            Cotton: { name: 'Cotton', desc: 'High yield in warm weather and balanced nutrients. Good drainage required.' },
            Sugarcane: { name: 'Sugarcane', desc: 'Long duration crop with high water requirement. High moisture levels are suitable for this.' },
            Soybean: { name: 'Soybean', desc: 'Improves soil fertility. It is suited for good growth in the current temperature.' }
        }
    },
    hi: {
        srcBlynk: ' (ब्लिंक)',
        navTitle: 'सॉइलरोवर एआई',
        title: 'मृदा गुणवत्ता सर्वेक्षण रोवर एआई फसल सिफारिश प्रणाली',
        subtitle: 'अपनी मिट्टी के लिए एआई-आधारित फसल सुझाव प्राप्त करने के लिए नीचे पर्यावरणीय मापदंड दर्ज करें।',
        temperature: 'तापमान',
        soilMoisture: 'मिट्टी की नमी',
        generateBtn: 'फसल सिफारिशें प्राप्त करें',
        autoAnalyzing: 'स्वचालित विश्लेषण...',
        recommendedCrop: 'अनुशंसित फसल',
        match: 'मिलान',
        sensorLive: 'सेंसर चालू',
        sensorOffline: 'कनेक्शन टूट गया - ब्रिज खोज रहे हैं...',
        connecting: 'कनेक्ट हो रहा है...',
        live: 'लाइव',
        aiBadge: 'एआई-आधारित सिफारिशें',
        statCrops: 'डेटाबेस में फसलें',
        statAccuracy: 'सटीकता दर',
        statParams: 'विश्लेषित पैरामीटर',
        tabRover: 'ईएसपी32 रोवर',
        tabManual: 'मैन्युअल प्रविष्टि',
        lblRoverTitle: 'ईएसपी32 मिट्टी रोवर',
        lblTemp: 'तापमान',
        lblMoist: 'नमी',
        lblRemoteProbe: 'रिमोट प्रोब नियंत्रण',
        btnFullCycle: 'पूरा चक्र',
        btnInsert: 'डालें',
        btnRetract: 'निकालें',
        lblEnvData: 'पर्यावरणीय डेटा',
        emptyState: 'एआई अनुकूलन लक्ष्य देखने के लिए बाईं ओर अपनी मिट्टी और जलवायु डेटा दर्ज करें',
        crops: {
            Rice: { name: 'चावल', desc: 'उच्च नमी और गर्म तापमान में उगने के लिए उत्तम। वर्तमान मिट्टी की स्थिति धान की खेती के लिए एकदम सही है।' },
            Wheat: { name: 'गेहूँ', desc: 'मध्यम तापमान और नमी के लिए आदर्श। उच्च अनाज गुणवत्ता सुनिश्चित करने के लिए उत्कृष्ट विकल्प।' },
            Maize: { name: 'मक्का', desc: 'गर्म परिस्थितियों और संतुलित नमी के लिए उपयुक्त बहुमुखी फसल। अच्छी जल निकासी आवश्यक है।' },
            Barley: { name: 'जौ', desc: 'अत्यधिक लचीला और कम नमी की आवश्यकता। वर्तमान ठंडे और सूखे वातावरण के लिए बढ़िया।' },
            Cotton: { name: 'कपास', desc: 'गर्म मौसम और संतुलित पोषक तत्वों में उच्च उपज। अच्छी जल निकासी की आवश्यकता है।' },
            Sugarcane: { name: 'गन्ना', desc: 'पानी की अधिक आवश्यकता के साथ लंबी अवधि की फसल। इसके लिए उच्च नमी स्तर उपयुक्त हैं।' },
            Soybean: { name: 'सोयाबीन', desc: 'मिट्टी की उर्वरता में सुधार करता है। यह मौजूदा तापमान में अच्छे विकास के लिए अनुकूल है।' }
        }
    },
    ta: {
        srcBlynk: ' (பிளிங்க்)',
        navTitle: 'சாயில்ரோவர் ஏஐ',
        title: 'மண் தர ஆய்வு ரோவர் ஏஐ பயிர் பரிந்துரை அமைப்பு',
        subtitle: 'உங்கள் மண்ணுக்கான ஏஐ சார்ந்த பயிர் பரிந்துரைகளைப் பெற கீழே சுற்றுச்சூழல் அளவுருக்களை உள்ளிடவும்.',
        temperature: 'வெப்பநிலை',
        soilMoisture: 'மண் ஈரப்பதம்',
        generateBtn: 'பயிர் பரிந்துரைகளைப் பெறுக',
        autoAnalyzing: 'தானியங்கி பகுப்பாய்வு...',
        recommendedCrop: 'பரிந்துரைக்கப்பட்ட பயிர்',
        match: 'பொருத்தம்',
        sensorLive: 'சென்சார் இயங்குகிறது',
        sensorOffline: 'இணைப்பு இல்லை - தேடுகிறது...',
        connecting: 'இணைக்கப் படுகிறது...',
        live: 'நேரடி',
        aiBadge: 'ஏஐ-பரிந்துரைகள்',
        statCrops: 'தரவுத்தளத்தில் பயிர்கள்',
        statAccuracy: 'துல்லிய விகிதம்',
        statParams: 'பகுப்பாய்வு அளவுருக்கள்',
        tabRover: 'ईएसपी32 ரோவர்',
        tabManual: 'கையேடு உள்ளீடு',
        lblRoverTitle: 'ईएसपी32 மண் ரோவர்',
        lblTemp: 'வெப்பம்',
        lblMoist: 'ஈரப்பதம்',
        lblRemoteProbe: 'தொலைவில் சென்சார் கட்டுப்பாடு',
        btnFullCycle: 'முழு சுழற்சி',
        btnInsert: 'உள்நுழை',
        btnRetract: 'திரும்பப் பெறு',
        lblEnvData: 'சுற்றுச்சூழல் தரவு',
        emptyState: 'ஏஐ இலக்குகளைக் காண உங்கள் மண் மற்றும் காலநிலை தரவுகளை உள்ளிடவும்',
        crops: {
            Rice: { name: 'நெல்', desc: 'அதிக ஈரப்பதம் மற்றும் சூடான வெப்பநிலையில் வளரும். தற்போதைய மண் நிலை நெற்பயிருக்கு மிகவும் ஏற்றது.' },
            Wheat: { name: 'கோதுமை', desc: 'மிதமான வெப்பநிலை மற்றும் ஈரப்பதத்திற்கு ஏற்றது. உயர் தானிய தரத்தை உறுதி செய்யும் சிறந்த தேர்வு.' },
            Maize: { name: 'மக்காச்சோளம்', desc: 'சூடான நிலைகள் மற்றும் சமநிலை ஈரப்பதத்திற்கு ஏற்ற பல்துறை பயிர்.' },
            Barley: { name: 'பார்லி', desc: 'மிகவும் நெகிழ்வானது, குறைந்த ஈரப்பதம் தேவை. குளிர்ந்த சூழலுக்கு சிறந்தது.' },
            Cotton: { name: 'பருத்தி', desc: 'வெப்பமண்டல காலநிலை தேவை. நீர் வடிகால் உகந்தது.' },
            Sugarcane: { name: 'கரும்பு', desc: 'அதிக நீர் தேவை. சிறந்த வளர்ச்சிக்கு தற்போதைய நிலை பொருத்தமானது.' },
            Soybean: { name: 'சோயாபீன்', desc: 'மண்ணின் தரத்தை மேம்படுத்தும் பயிர். தற்போதைய வெப்பநிலைக்கு ஏற்றது.' }
        }
    },
    te: {
        srcBlynk: ' (బ్లింక్)',
        navTitle: 'సాయిల్‌రోవర్ ఏఐ',
        title: 'నేల నాణ్యత అంచనా రోవర్ ఏఐ పంట సిఫార్సు వ్యవస్థ',
        subtitle: 'మీ నేలకు ఏఐ ఆధారిత పంట సూచనలను పొందడానికి క్రింద పర్యావరణ పారామీటర్లను నమోదు చేయండి.',
        temperature: 'ఉష్ణోగ్రత',
        soilMoisture: 'నేల తేమ',
        generateBtn: 'పంట సిఫార్సులు పొందండి',
        autoAnalyzing: 'విశ్లేషణ...',
        recommendedCrop: 'సిఫార్సు చేసిన పంట',
        match: 'సరిపోలిక',
        sensorLive: 'సెన్సార్ ఆన్',
        sensorOffline: 'కనెక్షన్ లేదు - వెతుకుతోంది...',
        connecting: 'కనెక్ట్ అవుతోంది...',
        live: 'లైవ్',
        aiBadge: 'ఏఐ-సూచనలు',
        statCrops: 'డేటాబేస్‌లో పంటలు',
        statAccuracy: 'ఖచ్చితత్వ రేటు',
        statParams: 'విశ్లేషించిన పారామితులు',
        tabRover: 'ईएसपी32 రోవర్',
        tabManual: 'మాన్యువల్ ఎంట్రీ',
        lblRoverTitle: 'ईएसपी32 నేల రోవర్',
        lblTemp: 'ఉష్ణోగ్రత',
        lblMoist: 'తేమ',
        lblRemoteProbe: 'రిమోట్ ప్రోబ్ నియంత్రణ',
        btnFullCycle: 'పూర్తి సైకిల్',
        btnInsert: 'లోపలికి',
        btnRetract: 'వెనక్కి',
        lblEnvData: 'పర్యావరణ డేటా',
        emptyState: 'ఏఐ ఆప్టిమైజేషన్ లక్ష్యాలను చూడటానికి మీ నేల మరియు వాతావరణ డేటాను నమోదు చేయండి',
        crops: {
            Rice: { name: 'వరి', desc: 'అధిక తేమ మరియు వెచ్చని ఉష్ణోగ్రతలలో బాగా పెరుగుతుంది. ప్రస్తుత నేల పరిస్థితులు వరి సాగుకు అనువైనవి.' },
            Wheat: { name: 'గోధుమ', desc: 'మితమైన ఉష్ణోగ్రతలు మరియు తేమకు అనువైనది. అధిక ధాన్యం నాణ్యతను నిర్ధారించే అద్భుతమైన ఎంపిక.' },
            Maize: { name: 'మొక్కజొన్న', desc: 'వెచ్చని పరిస్థితులు మరియు సమతుల్య తేమ స్థాయిలకు అనువైన బహుముఖ పంట.' },
            Barley: { name: 'బార్లీ', desc: 'అత్యంత స్థితిస్థాపకం మరియు తక్కువ తేమ అవసరం. చల్లని వాతావరణానికి చాలా బాగుంది.' },
            Cotton: { name: 'పత్తి', desc: 'వెచ్చని వాతావరణం మరియు సమతుల్య తేమ అవసరం. మంచి నీటి పారుదల ఉండాలి.' },
            Sugarcane: { name: 'చెరకు', desc: 'ఎక్కువ నీరు అవసరం. అధిక తేమ దీనికి అనువైనది.' },
            Soybean: { name: 'సోయాబీన్', desc: 'నేల సారాన్ని పెంచుతుంది. ప్రస్తుత ఉష్ణోగ్రతలో మంచి దిగుబడి వస్తుంది.' }
        }
    },
    kn: {
        srcBlynk: ' (ಬ್ಲಿಂಕ್)',
        navTitle: 'ಸಾಯಿಲ್‌ರೋವರ್ ಎಐ',
        title: 'ಮಣ್ಣು ಗುಣಮಟ್ಟ ಪರಿಶೀಲನಾ ರೋವರ್ ಎಐ ಬೆಳೆ ಶಿಫಾರಸು ವ್ಯವಸ್ಥೆ',
        subtitle: 'ನಿಮ್ಮ ಮಣ್ಣಿಗೆ ಎಐ ಆಧಾರಿತ ಬೆಳೆ ಸಲಹೆಗಳನ್ನು ಪಡೆಯಲು ಕೆಳಗಿನ ಪರಿಸರ ನಿಯತಾಂಕಗಳನ್ನು ನಮೂದಿಸಿ.',
        temperature: 'ತಾಪಮಾನ',
        soilMoisture: 'ಮಣ್ಣಿನ ತೇವಾಂಶ',
        generateBtn: 'ಬೆಳೆ ಶಿಫಾರಸುಗಳನ್ನು ಪಡೆಯಿರಿ',
        autoAnalyzing: 'ಸ್ವಯಂ ವಿಶ್ಲೇಷಣೆ...',
        recommendedCrop: 'ಶಿಫಾರಸು ಮಾಡಿದ ಬೆಳೆ',
        match: 'ಹೊಂದಾಣಿಕೆ',
        sensorLive: 'ಸೆನ್ಸಾರ್ ಆನ್',
        sensorOffline: 'ಸಂಪರ್ಕ ಕಡಿತಗೊಂಡಿದೆ...',
        connecting: 'ಸಂಪರ್ಕಿಸುತ್ತಿದೆ...',
        live: 'ಲೈವ್',
        aiBadge: 'ಎಐ-ಶಿಫಾರಸುಗಳು',
        statCrops: 'ಡೇಟಾಬೇಸಲ್ಲಿ ಬೆಳೆಗಳು',
        statAccuracy: 'ನಿಖರತೆ ದರ',
        statParams: 'ವಿಶ್ಲೇಷಣೆ ನಿಯತಾಂಕಗಳು',
        tabRover: 'ईएसपी32 ರೋವರ್',
        tabManual: 'ಹಸ್ತಚಾಲಿತ ಪ್ರವೇಶ',
        lblRoverTitle: 'ईएसपी32 ಮಣ್ಣಿನ ರೋವರ್',
        lblTemp: 'ತಾಪಮಾನ',
        lblMoist: 'ತೇವಾಂಶ',
        lblRemoteProbe: 'ರಿಮೋಟ್ ಪ್ರೋಬ್ ನಿಯಂತ್ರಣ',
        btnFullCycle: 'ಪೂರ್ಣ ಚಕ್ರ',
        btnInsert: 'ಸೇರಿಸಿ',
        btnRetract: 'ಹಿಂತೆಗೆದುಕೊಳ್ಳಿ',
        lblEnvData: 'ಪರಿಸರ ಡೇಟಾ',
        emptyState: 'ಎಐ ಗಳನ್ನು ನೋಡಲು ದಯವಿಟ್ಟು ಡೇಟಾವನ್ನು ನಮೂದಿಸಿ',
        crops: {
            Rice: { name: 'ಭತ್ತ', desc: 'ಹೆಚ್ಚಿನ ತೇವಾಂಶ ಮತ್ತು ಬಿಸಿ ತಾಪಮಾನದಲ್ಲಿ ಚೆನ್ನಾಗಿ ಬೆಳೆಯುತ್ತದೆ. ಪ್ರಸ್ತುತ ಮಣ್ಣಿನ ಸ್ಥಿತಿ ಭತ್ತಕ್ಕೆ ಸೂಕ್ತ.' },
            Wheat: { name: 'ಗೋಧಿ', desc: 'ಮಧ್ಯಮ ತಾಪಮಾನ ಮತ್ತು ತೇವಾಂಶಕ್ಕೆ ಸೂಕ್ತ. ಉತ್ತಮ ಧಾನ್ಯ ಗುಣಮಟ್ಟವನ್ನು ಖಚಿತಪಡಿಸುತ್ತದೆ.' },
            Maize: { name: 'ಜೋಳ', desc: 'ಬಿಸಿ ಪರಿಸ್ಥಿತಿಗಳು ಮತ್ತು ಸಮತೋಲಿತ ತೇವಾಂಶಕ್ಕೆ ಸೂಕ್ತ. ಒಳ್ಳೆಯ ಒಳಚರಂಡಿ ಅಗತ್ಯ.' },
            Barley: { name: 'ಬಾರ್ಲಿ', desc: 'ಹೆಚ್ಚು ಸ್ಥಿತಿಸ್ಥಾಪಕ ಮತ್ತು ಕಡಿಮೆ ತೇವಾಂಶ ಅಗತ್ಯ. ತಂಪು ವಾತಾವರಣಕ್ಕೆ ಉತ್ತಮ.' },
            Cotton: { name: 'ಹತ್ತಿ', desc: 'ಬೆಚ್ಚಗಿನ ವಾತಾವರಣಕ್ಕೆ ಸೂಕ್ತ. ಒಳ್ಳೆಯ ನೀರು ನಿರ್ವಹಣೆ ಇರಬೇಕು.' },
            Sugarcane: { name: 'ಕಬ್ಬು', desc: 'ಹೆಚ್ಚು ನೀರಿನ ಅಗತ್ಯವಿದೆ. ಇಂದಿನ ಸ್ಥಿತಿ ಉತ್ತಮವಾಗಿದೆ.' },
            Soybean: { name: 'ಸೋಯಾಬೀನ್', desc: 'ಮಣ್ಣಿನ ಫಲವತ್ತತೆ ಹೆಚ್ಚಿಸುತ್ತದೆ. ಪ್ರಸ್ತುತ ಸ್ಥಿತಿಯಲ್ಲಿ ಚೆನ್ನಾಗಿ ಬೆಳೆಯುತ್ತದೆ.' }
        }
    },
    mr: {
        srcBlynk: ' (ब्लिंक)',
        navTitle: 'सॉइलरोवर एआय',
        title: 'माती गुणवत्ता सर्वेक्षण रोव्हर एआय पीक शिफारस प्रणाली',
        subtitle: 'तुमच्या जमिनीसाठी एआई-आधारित पीक सूचना मिळवण्यासाठी खालील पर्यावरणीय मापदंड प्रविष्ट करा.',
        temperature: 'तापमान',
        soilMoisture: 'जमिनीतील ओलावा',
        generateBtn: 'पीक शिफारसी मिळवा',
        autoAnalyzing: 'स्वयंचालित विश्लेषण...',
        recommendedCrop: 'शिफारस केलेले पीक',
        match: 'जुळणी',
        sensorLive: 'सेन्सॉर चालू',
        sensorOffline: 'संपर्क तुटला - शोधत आहे...',
        connecting: 'कनेक्ट होत  आहे...',
        live: 'लाइव्ह',
        aiBadge: 'एआय-शिफारसी',
        statCrops: 'डेटाबेसमध्ये पिके',
        statAccuracy: 'अचूकता दर',
        statParams: 'विश्लेषित मापदंड',
        tabRover: 'ईएसपी32 रोव्हर',
        tabManual: 'मॅन्युअल एंट्री',
        lblRoverTitle: 'ईएसपी32 माती रोव्हर',
        lblTemp: 'तापमान',
        lblMoist: 'ओलावा',
        lblRemoteProbe: 'रिमोट प्रोब कंट्रोल',
        btnFullCycle: 'पूर्ण चक्र',
        btnInsert: 'आत घाला',
        btnRetract: 'बाहेर काढा',
        lblEnvData: 'पर्यावरणीय डेटा',
        emptyState: 'एआय उद्दिष्टे पाहण्यासाठी तुमची माती आणि हवामान डेटा प्रविष्ट करा',
        crops: {
            Rice: { name: 'तांदूळ', desc: 'उच्च ओलावा आणि उबदार तापमानात उत्तम वाढतो. सध्याची माती भात शेतीसाठी योग्य आहे.' },
            Wheat: { name: 'गहू', desc: 'मध्यम तापमान आणि ओलाव्यासाठी आदर्श. उच्च दर्जाच्या धान्यासाठी उत्कृष्ट निवड.' },
            Maize: { name: 'मका', desc: 'उबदार परिस्थिती आणि संतुलित ओलाव्यासाठी योग्य बहुमुखी पीक.' },
            Barley: { name: 'जव', desc: 'अत्यंत लवचिक आणि कमी ओलाव्याची आवश्यकता. थंड वातावरणासाठी उत्तम.' },
            Cotton: { name: 'कापूस', desc: 'उबदार हवामान आणि पाण्याचा निचरा होणारी जमीन आवश्यक आहे.' },
            Sugarcane: { name: 'ऊस', desc: 'पाण्याची जास्त आवश्यकता. सध्याचे ओलावा पातळी अनुकूल आहे.' },
            Soybean: { name: 'सोयाबीन', desc: 'जमिनीचा पोत सुधारते. अनुकूल तापमानात उत्तम उत्पादन.' }
        }
    },
    pa: {
        srcBlynk: ' (ਬਲਿੰਕ)',
        navTitle: 'ਸੌਇਲਰੋਵਰ ਏਆਈ',
        title: 'ਮਿੱਟੀ ਗੁਣਵੱਤਾ ਸਰਵੇਖਣ ਰੋਵਰ ਏਆਈ ਫ਼ਸਲ ਸਿਫ਼ਾਰਸ਼ ਪ੍ਰਣਾਲੀ',
        subtitle: 'ਆਪਣੀ ਮਿੱਟੀ ਲਈ ਏਆਈ-ਅਧਾਰਿਤ ਫ਼ਸਲ ਦੇ ਸੁਝਾਅ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਹੇਠਾਂ ਵਾਤਾਵਰਣ ਸੰਬੰਧੀ ਮਾਪਦੰਡ ਦਰਜ ਕਰੋ।',
        temperature: 'ਤਾਪਮਾਨ',
        soilMoisture: 'ਮਿੱਟੀ ਦੀ ਨਮੀ',
        generateBtn: 'ਫ਼ਸਲ ਦੀਆਂ ਸਿਫ਼ਾਰਸ਼ਾਂ ਪ੍ਰਾਪਤ ਕਰੋ',
        autoAnalyzing: 'ਸਵੈਚਲਿਤ ਵਿਸ਼ਲੇਸ਼ਣ...',
        recommendedCrop: 'ਸਿਫ਼ਾਰਸ਼ ਕੀਤੀ ਫ਼ਸਲ',
        match: 'ਮੇਲ',
        sensorLive: 'ਸੈਂਸਰ ਚਾਲੂ',
        sensorOffline: 'ਕਨੈਕਸ਼ਨ ਟੁੱਟ ਗਿਆ - ਲੱਭ ਰਿਹਾ ਹੈ...',
        connecting: 'ਕਨੈਕਟ ਹੋ ਰਿਹਾ ਹੈ...',
        live: 'ਲਾਈਵ',
        aiBadge: 'ਏਆਈ-ਸਿਫ਼ਾਰਸ਼ਾਂ',
        statCrops: 'ਡੇਟਾਬੇਸ ਵਿੱਚ ਫ਼ਸਲਾਂ',
        statAccuracy: 'ਸ਼ੁੱਧਤਾ ਦਰ',
        statParams: 'ਵਿਸ਼ਲੇਸ਼ਣ ਮਾਪਦੰਡ',
        tabRover: 'ईएसपी32 ਰੋਵਰ',
        tabManual: 'ਮੈਨੁਅਲ ਐਂਟਰੀ',
        lblRoverTitle: 'ईएसपी32 ਮਿੱਟੀ ਰੋਵਰ',
        lblTemp: 'ਤਾਪਮਾਨ',
        lblMoist: 'ਨਮੀ',
        lblRemoteProbe: 'ਰਿਮੋਟ ਪ੍ਰੋਬ ਕੰਟਰੋਲ',
        btnFullCycle: 'ਪੂਰਾ ਚੱਕਰ',
        btnInsert: 'ਪਾਓ',
        btnRetract: 'ਕੱਢੋ',
        lblEnvData: 'ਵਾਤਾਵਰਣ ਡੇਟਾ',
        emptyState: 'ਏਆਈ ਟੀਚਿਆਂ ਨੂੰ ਦੇਖਣ ਲਈ ਆਪਣੀ ਮਿੱਟੀ ਅਤੇ ਜਲਵਾਯੂ ਡੇਟਾ ਦਾਖਲ ਕਰੋ',
        crops: {
            Rice: { name: 'ਝੋਨਾ', desc: 'ਉੱਚ ਨਮੀ ਅਤੇ ਗਰਮ ਤਾਪਮਾਨ ਵਿੱਚ ਵਧੀਆ ਹੁੰਦਾ ਹੈ। ਮੌਜੂਦਾ ਮਿੱਟੀ ਝੋਨੇ ਲਈ ਬਹੁਤ ਵਧੀਆ ਹੈ।' },
            Wheat: { name: 'ਕਣਕ', desc: 'ਦਰਮਿਆਨੇ ਤਾਪਮਾਨ ਅਤੇ ਨਮੀ ਲਈ ਆਦਰਸ਼। ਉੱਚ ਗੁਣਵੱਤਾ ਦੀ ਪੈਦਾਵਾਰ ਲਈ ਵਧੀਆ।' },
            Maize: { name: 'ਮੱਕੀ', desc: 'ਗਰਮ ਹਾਲਾਤਾਂ ਅਤੇ ਸੰਤੁਲਿਤ ਨਮੀ ਲਈ ਢੁਕਵੀਂ ਬਹੁਮੁਖੀ ਫ਼ਸਲ।' },
            Barley: { name: 'ਜੌਂ', desc: 'ਬਹੁਤ ਲਚਕੀਲਾ ਅਤੇ ਘੱਟ ਨਮੀ ਦੀ ਲੋੜ ਹੈ। ਠੰਡੇ ਮੌਸਮ ਲਈ ਵਧੀਆ।' },
            Cotton: { name: 'ਕਪਾਹ', desc: 'ਗਰਮ ਮੌਸਮ ਅਤੇ ਚੰਗੇ ਨਿਕਾਸੀ ਵਾਲੀ ਜ਼ਮੀਨ ਦੀ ਲੋੜ ਹੈ।' },
            Sugarcane: { name: 'ਗੰਨਾ', desc: 'ਜ਼ਿਆਦਾ ਪਾਣੀ ਦੀ ਲੋੜ ਹੈ। ਮੌਜੂਦਾ ਨਮੀ ਬਹੁਤ ਵਧੀਆ ਹੈ।' },
            Soybean: { name: 'ਸੋਇਆਬੀਨ', desc: 'ਮਿੱਟੀ ਦੀ ਉਪਜਾਊ ਸ਼ਕਤੀ ਵਧਾਉਂਦਾ ਹੈ। ਮੌਜੂਦਾ ਤਾਪਮਾਨ ਦੇ ਅਨੁਕੂਲ।' }
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
            desc: `Optimal for current parameters. High yield potential.`
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

    if (isLiveMode) {
        if (latestSensorData) {
            temp = (latestSensorData.temperature !== null && latestSensorData.temperature !== undefined) ? latestSensorData.temperature : 25;
            moisture = (latestSensorData.moisture !== null && latestSensorData.moisture !== undefined) ? latestSensorData.moisture : 40;
            N = (latestSensorData.N !== null && latestSensorData.N !== undefined) ? latestSensorData.N : undefined;
            P = (latestSensorData.P !== null && latestSensorData.P !== undefined) ? latestSensorData.P : undefined;
            K = (latestSensorData.K !== null && latestSensorData.K !== undefined) ? latestSensorData.K : undefined;
            ph = (latestSensorData.ph !== null && latestSensorData.ph !== undefined) ? latestSensorData.ph : undefined;
        } else {
            temp = 25;
            moisture = 40;
            N = P = K = ph = undefined;
        }
    } else {
        const pTemp = parseFloat(tempInput.value);
        temp = !isNaN(pTemp) ? pTemp : 25;
        
        const pMoist = parseFloat(moistureInput.value);
        moisture = !isNaN(pMoist) ? pMoist : 40;
        
        N = undefined;
        P = undefined;
        K = undefined;
        ph = undefined;
    }

    // Send data to Web Worker for low-latency non-blocking processing.
    const payload = { temp, moisture };
    if (N !== undefined) payload.N = N;
    if (P !== undefined) payload.P = P;
    if (K !== undefined) payload.K = K;
    if (ph !== undefined) payload.ph = ph;
    
    aiWorker.postMessage(payload);
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
            latestSensorData = data;
            
            if (!isLiveMode) return; 

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
    const probeBtns = document.querySelectorAll('.btn-probe');

    switch (state) {
        case 'connected':
            statusText.textContent = t('sensorLive') + sourceLabel;
            probeBtns.forEach(btn => btn.disabled = false);
            break;
        case 'disconnected':
            statusText.textContent = t('sensorOffline');
            probeBtns.forEach(btn => btn.disabled = true);
            break;
        case 'reconnecting':
            statusText.textContent = t('connecting') + sourceLabel;
            probeBtns.forEach(btn => btn.disabled = true);
            break;
    }
}

// ─── Probe Controls ──────────────────────────────────────────────
function sendCommand(cmdName) {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({ type: 'command', command: cmdName }));
    console.log(`📡 Sent command: ${cmdName}`);
}

const btnProbe = document.getElementById('btn-probe');
const btnDown = document.getElementById('btn-down');
const btnUp = document.getElementById('btn-up');

if (btnProbe) btnProbe.addEventListener('click', () => sendCommand('probe'));
if (btnDown) btnDown.addEventListener('click', () => sendCommand('down'));
if (btnUp) btnUp.addEventListener('click', () => sendCommand('up'));


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
