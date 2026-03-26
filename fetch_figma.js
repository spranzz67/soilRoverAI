const https = require('https');
const fs = require('fs');

https.get('https://dandy-khaki-45826872.figma.site', (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        fs.writeFileSync('figma_source.html', data);
        console.log('Figma source downloaded.');
    });
}).on('error', (err) => {
    console.error('Error fetching Figma site:', err);
});
