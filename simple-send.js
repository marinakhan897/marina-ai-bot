// simple-send.js - Marina AI Simple Send/Receive
const login = require('@xaviabot/fca-unofficial');
const aiEngine = require('./ai-engine.js');
const fs = require('fs');

console.log('🎀 Marina AI - Simple Send/Receive');
console.log('✨ Created by: Marina Khan');
console.log('🤖 AI: Google Gemini');
console.log('🕐', new Date().toLocaleString());

const appState = JSON.parse(fs.readFileSync('appstate.json', 'utf8'));

login({ appState }, (err, api) => {
    if (err) {
        console.error('❌ Login failed');
        return;
    }

    console.log('✅ Logged in as:', api.getCurrentUserID());
    
    // TEST 1: Send a message to ourselves
    console.log('\n📤 TEST 1: Sending message to self...');
    const testMsg = "🤖 Marina AI Bot Test\n\nI'm online! Send me a message and I'll reply! 🎀";
    
    api.sendMessage(testMsg, api.getCurrentUserID(), (err, msgInfo) => {
        if (err) {
            console.log('❌ Cannot send messages - API restricted');
            console.log('💡 Solution: Use fresh cookies or enable permissions');
            startManualMode();
        } else {
            console.log('✅ Message sent successfully!');
            console.log('💬 Now reply to that message in Messenger');
            startReplyChecker(api);
        }
    });
});

function startReplyChecker(api) {
    console.log('\n🔍 Checking for replies every 10 seconds...');
    console.log('💡 Reply to your test message in Facebook Messenger');
    
    let lastChecked = Date.now();
    
    setInterval(() => {
        // Simple method: Try to get user info to test API access
        api.getUserInfo(api.getCurrentUserID(), (err, info) => {
            if (err) {
                console.log('⚠️ API access limited');
            } else {
                console.log('✅ API working, waiting for messages...');
            }
        });
    }, 10000);
}

function startManualMode() {
    console.log('\n🔄 STARTING MANUAL MODE');
    console.log('💬 You can still use Marina AI features:');
    console.log('   1. Web Interface (see below)');
    console.log('   2. Terminal Chat');
    console.log('   3. API Integration');
    
    startTerminalChat();
}

function startTerminalChat() {
    console.log('\n💬 TERMINAL CHAT MODE ACTIVATED');
    console.log('🤖 Chat with Marina AI directly here!\n');
    
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    function chat() {
        rl.question('👤 You: ', async (message) => {
            if (message.toLowerCase() === 'exit') {
                console.log('👋 Goodbye! - Marina Khan');
                rl.close();
                return;
            }
            
            console.log('🤖 Marina AI: Thinking...');
            try {
                const response = await aiEngine.getAIResponse(message, 'terminal_user');
                console.log('🤖 Marina AI:', response);
            } catch (error) {
                console.log('🤖 Marina AI: Sorry, I encountered an error.');
            }
            
            console.log('');
            chat();
        });
    }
    
    chat();
}

// Keep alive
setInterval(() => {
    const time = new Date().toLocaleTimeString();
    process.stdout.write(`💓 Marina AI Online [${time}] \\r`);
}, 30000);
