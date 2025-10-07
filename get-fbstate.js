// get-fbstate.js - Simple FBState Generator for Marina AI Bot
const fs = require('fs');
const readline = require('readline');

console.log('🎀 Marina AI FBState Generator');
console.log('✨ Created by: Marina Khan');
console.log('================================');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function showInstructions() {
    console.log('\n📋 INSTRUCTIONS:');
    console.log('1. Open Facebook in your browser');
    console.log('2. Press F12 to open Developer Tools');
    console.log('3. Click on "Console" tab');
    console.log('4. Paste this code and press Enter:');
    console.log('\n\x1b[36m%s\x1b[0m', '   document.cookie');
    console.log('\n5. Copy ALL the text that appears');
    console.log('6. Paste it here\n');
}

function generateFBState(cookies) {
    try {
        const cookieArray = cookies.split(';').map(cookie => {
            const [name, ...valueParts] = cookie.trim().split('=');
            const value = valueParts.join('=');
            return { name: name.trim(), value: value.trim() };
        });

        // Filter relevant Facebook cookies
        const fbCookies = cookieArray.filter(cookie => 
            cookie.name.includes('c_user') || 
            cookie.name.includes('xs') || 
            cookie.name.includes('fr') ||
            cookie.name.includes('datr') ||
            cookie.name.includes('sb')
        );

        if (fbCookies.length === 0) {
            throw new Error('No valid Facebook cookies found');
        }

        const appState = fbCookies.map(cookie => ({
            key: cookie.name,
            value: cookie.value,
            domain: '.facebook.com',
            path: '/',
            expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            secure: true,
            hostOnly: false
        }));

        // Save to appstate.json
        fs.writeFileSync('appstate.json', JSON.stringify(appState, null, 2));
        
        console.log('\n✅ SUCCESS! FBState generated and saved as appstate.json');
        console.log('📁 File: appstate.json');
        console.log('🔐 Cookies found: ' + fbCookies.length);
        
        fbCookies.forEach(cookie => {
            console.log('   • ' + cookie.name + ' = ' + cookie.value.substring(0, 20) + '...');
        });
        
        console.log('\n🚀 Now run: npm start');
        console.log('💖 Your Marina AI Bot will login automatically!');
        
    } catch (error) {
        console.error('\n❌ ERROR: ' + error.message);
        console.log('💡 Make sure you copied the entire cookie string');
    }
}

// Start the generator
showInstructions();

rl.question('📋 Paste your Facebook cookies here: ', (cookies) => {
    if (!cookies.trim()) {
        console.log('❌ No cookies provided. Please try again.');
        rl.close();
        return;
    }
    
    generateFBState(cookies);
    rl.close();
});

rl.on('close', () => {
    console.log('\n🎀 Thank you for using Marina AI Bot!');
    process.exit(0);
});
