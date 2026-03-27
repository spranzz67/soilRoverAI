const fs = require('fs');
let scriptObj = fs.readFileSync('script.js', 'utf8');

scriptObj = scriptObj.replace(/'ESP32/g, "'ईएसपी32"); // Hindi, Marathi
scriptObj = scriptObj.replace(/ESP32 रोवर/g, 'ईएसपी32 रोवर'); // Hindi, Marathi
scriptObj = scriptObj.replace(/ESP32 मिट्टी/g, 'ईएसपी32 मिट्टी');
scriptObj = scriptObj.replace(/ESP32 माती/g, 'ईएसपी32 माती'); 
scriptObj = scriptObj.replace(/ESP32 ரோவர்/g, 'இஎஸ்பி32 ரோவர்');
scriptObj = scriptObj.replace(/ESP32 மண்/g, 'இஎஸ்பி32 மண்');
scriptObj = scriptObj.replace(/ESP32 రోవర్/g, 'ఈఎస్‌పి32 రోవర్');
scriptObj = scriptObj.replace(/ESP32 నేల/g, 'ఈఎస్‌పి32 నేల');
scriptObj = scriptObj.replace(/ESP32 ರೋವರ್/g, 'ಇಎಸ್‌ಪಿ32 ರೋವರ್');
scriptObj = scriptObj.replace(/ESP32 ಮಣ್ಣಿನ/g, 'ಇಎಸ್‌ಪಿ32 ಮಣ್ಣಿನ');
scriptObj = scriptObj.replace(/ESP32 ਰੋਵਰ/g, 'ਈਐਸਪੀ32 ਰੋਵਰ');
scriptObj = scriptObj.replace(/ESP32 ਮਿੱਟੀ/g, 'ਈਐਸਪੀ32 ਮਿੱਟੀ');

// AI replacements
scriptObj = scriptObj.replace(/AI फसल/g, 'एआई फसल');
scriptObj = scriptObj.replace(/AI-आधारित/g, 'एआई-आधारित');
scriptObj = scriptObj.replace(/AI अनुकूलन/g, 'एआई अनुकूलन');
scriptObj = scriptObj.replace(/AI पीक/g, 'एआय पीक');
scriptObj = scriptObj.replace(/AI-शिफारसी/g, 'एआय-शिफारसी');
scriptObj = scriptObj.replace(/AI उद्दिष्टे/g, 'एआय उद्दिष्टे');
scriptObj = scriptObj.replace(/AI பயிர்/g, 'ஏஐ பயிர்');
scriptObj = scriptObj.replace(/AI இலக்குகளைக்/g, 'ஏஐ இலக்குகளைக்');
scriptObj = scriptObj.replace(/AI-பரிந்துரைகள்/g, 'ஏஐ-பரிந்துரைகள்');
scriptObj = scriptObj.replace(/AI சார்ந்த/g, 'ஏஐ சார்ந்த');
scriptObj = scriptObj.replace(/AI పంట/g, 'ఏఐ పంట');
scriptObj = scriptObj.replace(/AI ఆధారిత/g, 'ఏఐ ఆధారిత');
scriptObj = scriptObj.replace(/AI-సూచనలు/g, 'ఏఐ-సూచనలు');
scriptObj = scriptObj.replace(/AI ఆప్టిమైజేషన్/g, 'ఏఐ ఆప్టిమైజేషన్');
scriptObj = scriptObj.replace(/AI ಬೆಳೆ/g, 'ಎಐ ಬೆಳೆ');
scriptObj = scriptObj.replace(/AI ಆಧಾರಿತ/g, 'ಎಐ ಆಧಾರಿತ');
scriptObj = scriptObj.replace(/AI-ಶಿಫಾರಸುಗಳು/g, 'ಎಐ-ಶಿಫಾರಸುಗಳು');
scriptObj = scriptObj.replace(/AI ಗಳನ್ನು/g, 'ಎಐ ಗಳನ್ನು');
scriptObj = scriptObj.replace(/AI ਫ਼ਸਲ/g, 'ਏਆਈ ਫ਼ਸਲ');
scriptObj = scriptObj.replace(/AI-ਅਧਾਰਿਤ/g, 'ਏਆਈ-ਅਧਾਰਿਤ');
scriptObj = scriptObj.replace(/AI-ਸਿਫ਼ਾਰਸ਼ਾਂ/g, 'ਏਆਈ-ਸਿਫ਼ਾਰਸ਼ਾਂ');
scriptObj = scriptObj.replace(/AI ਟੀਚਿਆਂ/g, 'ਏਆਈ ਟੀਚਿਆਂ');

// Title / NavTitle translation addition
scriptObj = scriptObj.replace(/title: 'मृदा/g, "navTitle: 'सॉइलरोवर एआई',\n        title: 'मृदा");
scriptObj = scriptObj.replace(/title: 'माती/g, "navTitle: 'सॉइलरोवर एआय',\n        title: 'माती");
scriptObj = scriptObj.replace(/title: 'மண்/g, "navTitle: 'சாயில்ரோவர் ஏஐ',\n        title: 'மண்");
scriptObj = scriptObj.replace(/title: 'నేల/g, "navTitle: 'సాయిల్‌రోవర్ ఏఐ',\n        title: 'నేల");
scriptObj = scriptObj.replace(/title: 'ಮಣ್ಣು/g, "navTitle: 'ಸಾಯಿಲ್‌ರೋವರ್ ಎಐ',\n        title: 'ಮಣ್ಣು");
scriptObj = scriptObj.replace(/title: 'ਮਿੱਟੀ/g, "navTitle: 'ਸੌਇਲਰੋਵਰ ਏਆਈ',\n        title: 'ਮਿੱਟੀ");

// srcBlynk addition
scriptObj = scriptObj.replace(/navTitle: 'सॉइलरोवर एआई',/g, "srcBlynk: ' (ब्लिंक)',\n        navTitle: 'सॉइलरोवर एआई',");
scriptObj = scriptObj.replace(/navTitle: 'सॉइलरोवर एआय',/g, "srcBlynk: ' (ब्लिंक)',\n        navTitle: 'सॉइलरोवर एआय',");
scriptObj = scriptObj.replace(/navTitle: 'சாயில்ரோவர் ஏஐ',/g, "srcBlynk: ' (பிளிங்க்)',\n        navTitle: 'சாயில்ரோவர் ஏஐ',");
scriptObj = scriptObj.replace(/navTitle: 'సాయిల్‌రోవర్ ఏఐ',/g, "srcBlynk: ' (బ్లింక్)',\n        navTitle: 'సాయిల్‌రోవర్ ఏఐ',");
scriptObj = scriptObj.replace(/navTitle: 'ಸಾಯಿಲ್‌ರೋವರ್ ಎಐ',/g, "srcBlynk: ' (ಬ್ಲಿಂಕ್)',\n        navTitle: 'ಸಾಯಿಲ್‌ರೋವರ್ ಎಐ',");
scriptObj = scriptObj.replace(/navTitle: 'ਸੌਇਲਰੋਵਰ ਏਆਈ',/g, "srcBlynk: ' (ਬਲਿੰਕ)',\n        navTitle: 'ਸੌਇਲਰੋਵਰ ਏਆਈ',");

// Update usage of blynk and °C
scriptObj = scriptObj.replace(/const sourceLabel \= dataSource \=\=\= 'blynk' \? ' \\(Blynk\\)' : '';/g, "const sourceLabel = dataSource === 'blynk' ? t('srcBlynk') : '';");

// Also replace % with plain text percentage if they don't want English symbols? % is universal, °C is just C, but let's leave % as is.
fs.writeFileSync('script.js', scriptObj);
console.log('Replacements completed.');
