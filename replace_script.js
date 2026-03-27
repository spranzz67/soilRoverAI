const fs = require('fs');

const file_path = "script.js";
let content = fs.readFileSync(file_path, 'utf8');

// 1. Replace the currentLang default
content = content.replace(
    "let currentLang = localStorage.getItem('agroai-lang') || 'en';",
    "let currentLang = localStorage.getItem('agroai-lang') || 'hi';\nif(currentLang === 'en') currentLang = 'hi';"
);

// 2. Extract the translations object (we'll replace it)
const new_translations = `const translations = {
    hi: {
        title: 'मृदा गुणवत्ता सर्वेक्षण रोवर AI फसल सिफारिश प्रणाली',
        subtitle: 'अपनी मिट्टी के लिए AI-आधारित फसल सुझाव प्राप्त करने के लिए नीचे पर्यावरणीय मापदंड दर्ज करें।',
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
        aiBadge: 'AI-आधारित सिफारिशें',
        statCrops: 'डेटाबेस में फसलें',
        statAccuracy: 'सटीकता दर',
        statParams: 'विश्लेषित पैरामीटर',
        tabRover: 'ESP32 रोवर',
        tabManual: 'मैन्युअल प्रविष्टि',
        lblRoverTitle: 'ESP32 मिट्टी रोवर',
        lblTemp: 'तापमान',
        lblMoist: 'नमी',
        lblRemoteProbe: 'रिमोट प्रोब नियंत्रण',
        btnFullCycle: 'पूरा चक्र',
        btnInsert: 'डालें',
        btnRetract: 'निकालें',
        lblEnvData: 'पर्यावरणीय डेटा',
        emptyState: 'AI अनुकूलन लक्ष्य देखने के लिए बाईं ओर अपनी मिट्टी और जलवायु डेटा दर्ज करें',
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
        title: 'மண் தர ஆய்வு ரோவர் AI பயிர் பரிந்துரை அமைப்பு',
        subtitle: 'உங்கள் மண்ணுக்கான AI சார்ந்த பயிர் பரிந்துரைகளைப் பெற கீழே சுற்றுச்சூழல் அளவுருக்களை உள்ளிடவும்.',
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
        aiBadge: 'AI-பரிந்துரைகள்',
        statCrops: 'தரவுத்தளத்தில் பயிர்கள்',
        statAccuracy: 'துல்லிய விகிதம்',
        statParams: 'பகுப்பாய்வு அளவுருக்கள்',
        tabRover: 'ESP32 ரோவர்',
        tabManual: 'கையேடு உள்ளீடு',
        lblRoverTitle: 'ESP32 மண் ரோவர்',
        lblTemp: 'வெப்பம்',
        lblMoist: 'ஈரப்பதம்',
        lblRemoteProbe: 'தொலைவில் சென்சார் கட்டுப்பாடு',
        btnFullCycle: 'முழு சுழற்சி',
        btnInsert: 'உள்நுழை',
        btnRetract: 'திரும்பப் பெறு',
        lblEnvData: 'சுற்றுச்சூழல் தரவு',
        emptyState: 'AI இலக்குகளைக் காண உங்கள் மண் மற்றும் காலநிலை தரவுகளை உள்ளிடவும்',
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
        title: 'నేల నాణ్యత అంచనా రోవర్ AI పంట సిఫార్సు వ్యవస్థ',
        subtitle: 'మీ నేలకు AI ఆధారిత పంట సూచనలను పొందడానికి క్రింద పర్యావరణ పారామీటర్లను నమోదు చేయండి.',
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
        aiBadge: 'AI-సూచనలు',
        statCrops: 'డేటాబేస్‌లో పంటలు',
        statAccuracy: 'ఖచ్చితత్వ రేటు',
        statParams: 'విశ్లేషించిన పారామితులు',
        tabRover: 'ESP32 రోవర్',
        tabManual: 'మాన్యువల్ ఎంట్రీ',
        lblRoverTitle: 'ESP32 నేల రోవర్',
        lblTemp: 'ఉష్ణోగ్రత',
        lblMoist: 'తేమ',
        lblRemoteProbe: 'రిమోట్ ప్రోబ్ నియంత్రణ',
        btnFullCycle: 'పూర్తి సైకిల్',
        btnInsert: 'లోపలికి',
        btnRetract: 'వెనక్కి',
        lblEnvData: 'పర్యావరణ డేటా',
        emptyState: 'AI ఆప్టిమైజేషన్ లక్ష్యాలను చూడటానికి మీ నేల మరియు వాతావరణ డేటాను నమోదు చేయండి',
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
        title: 'ಮಣ್ಣು ಗುಣಮಟ್ಟ ಪರಿಶೀಲನಾ ರೋವರ್ AI ಬೆಳೆ ಶಿಫಾರಸು ವ್ಯವಸ್ಥೆ',
        subtitle: 'ನಿಮ್ಮ ಮಣ್ಣಿಗೆ AI ಆಧಾರಿತ ಬೆಳೆ ಸಲಹೆಗಳನ್ನು ಪಡೆಯಲು ಕೆಳಗಿನ ಪರಿಸರ ನಿಯತಾಂಕಗಳನ್ನು ನಮೂದಿಸಿ.',
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
        aiBadge: 'AI-ಶಿಫಾರಸುಗಳು',
        statCrops: 'ಡೇಟಾಬೇಸಲ್ಲಿ ಬೆಳೆಗಳು',
        statAccuracy: 'ನಿಖರತೆ ದರ',
        statParams: 'ವಿಶ್ಲೇಷಣೆ ನಿಯತಾಂಕಗಳು',
        tabRover: 'ESP32 ರೋವರ್',
        tabManual: 'ಹಸ್ತಚಾಲಿತ ಪ್ರವೇಶ',
        lblRoverTitle: 'ESP32 ಮಣ್ಣಿನ ರೋವರ್',
        lblTemp: 'ತಾಪಮಾನ',
        lblMoist: 'ತೇವಾಂಶ',
        lblRemoteProbe: 'ರಿಮೋಟ್ ಪ್ರೋಬ್ ನಿಯಂತ್ರಣ',
        btnFullCycle: 'ಪೂರ್ಣ ಚಕ್ರ',
        btnInsert: 'ಸೇರಿಸಿ',
        btnRetract: 'ಹಿಂತೆಗೆದುಕೊಳ್ಳಿ',
        lblEnvData: 'ಪರಿಸರ ಡೇಟಾ',
        emptyState: 'AI ಗಳನ್ನು ನೋಡಲು ದಯವಿಟ್ಟು ಡೇಟಾವನ್ನು ನಮೂದಿಸಿ',
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
        title: 'माती गुणवत्ता सर्वेक्षण रोव्हर AI पीक शिफारस प्रणाली',
        subtitle: 'तुमच्या जमिनीसाठी AI-आधारित पीक सूचना मिळवण्यासाठी खालील पर्यावरणीय मापदंड प्रविष्ट करा.',
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
        aiBadge: 'AI-शिफारसी',
        statCrops: 'डेटाबेसमध्ये पिके',
        statAccuracy: 'अचूकता दर',
        statParams: 'विश्लेषित मापदंड',
        tabRover: 'ESP32 रोव्हर',
        tabManual: 'मॅन्युअल एंट्री',
        lblRoverTitle: 'ESP32 माती रोव्हर',
        lblTemp: 'तापमान',
        lblMoist: 'ओलावा',
        lblRemoteProbe: 'रिमोट प्रोब कंट्रोल',
        btnFullCycle: 'पूर्ण चक्र',
        btnInsert: 'आत घाला',
        btnRetract: 'बाहेर काढा',
        lblEnvData: 'पर्यावरणीय डेटा',
        emptyState: 'AI उद्दिष्टे पाहण्यासाठी तुमची माती आणि हवामान डेटा प्रविष्ट करा',
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
        title: 'ਮਿੱਟੀ ਗੁਣਵੱਤਾ ਸਰਵੇਖਣ ਰੋਵਰ AI ਫ਼ਸਲ ਸਿਫ਼ਾਰਸ਼ ਪ੍ਰਣਾਲੀ',
        subtitle: 'ਆਪਣੀ ਮਿੱਟੀ ਲਈ AI-ਅਧਾਰਿਤ ਫ਼ਸਲ ਦੇ ਸੁਝਾਅ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਹੇਠਾਂ ਵਾਤਾਵਰਣ ਸੰਬੰਧੀ ਮਾਪਦੰਡ ਦਰਜ ਕਰੋ।',
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
        aiBadge: 'AI-ਸਿਫ਼ਾਰਸ਼ਾਂ',
        statCrops: 'ਡੇਟਾਬੇਸ ਵਿੱਚ ਫ਼ਸਲਾਂ',
        statAccuracy: 'ਸ਼ੁੱਧਤਾ ਦਰ',
        statParams: 'ਵਿਸ਼ਲੇਸ਼ਣ ਮਾਪਦੰਡ',
        tabRover: 'ESP32 ਰੋਵਰ',
        tabManual: 'ਮੈਨੁਅਲ ਐਂਟਰੀ',
        lblRoverTitle: 'ESP32 ਮਿੱਟੀ ਰੋਵਰ',
        lblTemp: 'ਤਾਪਮਾਨ',
        lblMoist: 'ਨਮੀ',
        lblRemoteProbe: 'ਰਿਮੋਟ ਪ੍ਰੋਬ ਕੰਟਰੋਲ',
        btnFullCycle: 'ਪੂਰਾ ਚੱਕਰ',
        btnInsert: 'ਪਾਓ',
        btnRetract: 'ਕੱਢੋ',
        lblEnvData: 'ਵਾਤਾਵਰਣ ਡੇਟਾ',
        emptyState: 'AI ਟੀਚਿਆਂ ਨੂੰ ਦੇਖਣ ਲਈ ਆਪਣੀ ਮਿੱਟੀ ਅਤੇ ਜਲਵਾਯੂ ਡੇਟਾ ਦਾਖਲ ਕਰੋ',
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

// Apply translations to all data-i18n elements`;

content = content.replace(/const translations = \{[\s\S]*?\};\s*\n\/\/ Apply translations to all data-i18n elements/, new_translations);

// 3. Modify applyTranslations function (replace translations.en -> translations.hi)
content = content.replace(/translations\.en/g, "translations.hi");

// 4. Modify AI Worker Response Handler English strings
content = content.replace(
    "desc: `Optimal for current readings. High yield probability based on granular ML analysis.`",
    "desc: `वर्तमान मापदंडों के लिए इष्टतम। उच्च उपज की संभावना है।`"
);

fs.writeFileSync(file_path, content, 'utf8');
console.log("Done replacing.");
