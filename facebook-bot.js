// facebook-bot.js - Marina AI Facebook Bot
const login = require('@xaviabot/fca-unofficial');
const commandHandler = require('./command-handler.js');
const aiEngine = require('./ai-engine.js');
const fs = require('fs');

console.log('🎀 Marina AI Facebook Bot Starting...');
console.log('✨ Created by: Marina Khan');
console.log('🤖 AI: Google Gemini');
console.log('🔐 Login: FBState System');
console.log('🕐', new Date().toLocaleString());

// Check if appstate exists
if (!fs.existsSync('appstate.json')) {
    console.log('❌ appstate.json not found!');
    process.exit(1);
}

console.log('✅ Found appstate.json');
const appState = JSON.parse(fs.readFileSync('appstate.json', 'utf8'));

// Login with FBState
login({ appState }, (err, api) => {
    if (err) {
        console.error('❌ Login failed:', err);
        console.log('💡 Trying alternative login method...');
        tryAlternativeLogin();
        return;
    }

    console.log('✅ Successfully logged in to Facebook!');
    console.log('👤 User ID:', api.getCurrentUserID());
    
    // Initialize command handler
    const handler = commandHandler.startBot();
    console.log('📋 Commands loaded:', handler.getCommandList());
    
    // Start listening for messages
    startBot(api, handler);
});

function startBot(api, handler) {
    console.log('\n👂 Listening for Facebook messages...');
    console.log('💬 Auto-response: ENABLED');
    console.log('🤖 AI: ACTIVE');
    console.log('🎀 Creator: Marina Khan');
    console.log('⏹️  Press Ctrl+C to stop\n');
    
    api.setOptions({
        listenEvents: true,
        selfListen: false,
        logLevel: 'silent'
    });

    api.listen((err, event) => {
        if (err) {
            console.error('❌ Listen error:', err);
            return;
        }
        
        handleMessage(api, event, handler);
    });
}

async function handleMessage(api, event, handler) {
    if (event.type !== 'message' || event.body === '') return;
    
    const message = event.body;
    const senderID = event.senderID;
    const threadID = event.threadID;
    const messageID = event.messageID;

    console.log(`\n📩 Message from ${senderID}:`);
    console.log(`   💬: ${message}`);

    // Mark as read
    api.markAsRead(threadID, (err) => {
        if (err) console.log('   ⚠️ Mark as read failed');
    });

    // Show typing indicator
    api.sendTypingIndicator(threadID, (err) => {
        if (err) console.log('   ⚠️ Typing indicator failed');
    });

    // Handle commands or auto-respond
    if (message.startsWith('.') || message.startsWith('!')) {
        const commandText = message.slice(1).trim();
        const [commandName, ...args] = commandText.split(' ');
        
        console.log(`   🔍 Command: ${commandName}`);
        await handler.handleCommand(api, event, commandName, args);
    } else {
        // Auto-respond with AI
        await handleAIResponse(api, event, message);
    }
}

async function handleAIResponse(api, event, message) {
    try {
        console.log('   🤖 Getting AI response...');
        
        const aiResponse = await aiEngine.getAIResponse(message, event.senderID);
        
        console.log('   ✅ Response ready');
        
        // Send response
        api.sendMessage({
            body: aiResponse
        }, event.threadID, (err, messageInfo) => {
            if (err) {
                console.error('   ❌ Send failed:', err);
            } else {
                console.log('   💌 Message sent successfully!');
            }
        });

    } catch (error) {
        console.error('   ❌ AI response error:', error);
    }
}

function tryAlternativeLogin() {
    console.log('🔄 Using alternative method...');
    // We'll implement fallback if needed
}

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down Marina AI Bot...');
    console.log('💖 Goodbye! - Marina Khan');
    process.exit(0);
});
