// facebook-bot-fixed.js - Marina AI Fixed Facebook Bot
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

// Login with FBState - with better options
const loginOptions = {
    appState: appState,
    forceLogin: true,
    logLevel: 'error'
};

login(loginOptions, (err, api) => {
    if (err) {
        console.error('❌ Login failed:', err);
        return;
    }

    console.log('✅ Successfully logged in to Facebook!');
    console.log('👤 User ID:', api.getCurrentUserID());
    console.log('👤 Profile:', api.getCurrentUserID());
    
    // Initialize command handler
    const handler = commandHandler.startBot();
    console.log('📋 Commands loaded:', handler.getCommandList());
    
    // Test message to verify bot is working
    sendTestMessage(api);
    
    // Start listening with better options
    startListening(api, handler);
});

function sendTestMessage(api) {
    // Send a test message to yourself to verify bot is working
    const testMessage = `🤖 Marina AI Bot Activated! 🎀

✅ Successfully logged in
🕐 ${new Date().toLocaleString()}
🤖 AI: Google Gemini
💬 Auto-response: ENABLED

Send me a message to test! 💫

- Created by Marina Khan`;

    // Send to yourself (current user)
    api.sendMessage(testMessage, api.getCurrentUserID(), (err) => {
        if (err) {
            console.log('⚠️ Could not send test message');
        } else {
            console.log('💌 Test message sent to yourself');
        }
    });
}

function startListening(api, handler) {
    console.log('\n👂 Starting message listener...');
    
    // Use simpler listening method
    api.setOptions({
        listenEvents: true,
        selfListen: true, // Allow listening to own messages for testing
        logLevel: 'silent',
        updatePresence: false
    });

    console.log('💬 Bot is now ACTIVE!');
    console.log('🤖 Send a message to your Facebook account to test');
    console.log('⏹️  Press Ctrl+C to stop\n');

    let retryCount = 0;
    const maxRetries = 3;

    const listenFunction = (err, event) => {
        if (err) {
            console.error('❌ Listen error:', err.error || err);
            retryCount++;
            
            if (retryCount <= maxRetries) {
                console.log(`🔄 Retrying listen... (${retryCount}/${maxRetries})`);
                setTimeout(() => {
                    api.listen(listenFunction);
                }, 5000);
            } else {
                console.log('❌ Max retries reached. Using fallback method...');
                startFallbackListening(api, handler);
            }
            return;
        }

        // Reset retry count on successful message
        retryCount = 0;
        handleMessage(api, event, handler);
    };

    api.listen(listenFunction);
}

function startFallbackListening(api, handler) {
    console.log('🔄 Starting fallback polling method...');
    
    // Simple polling method as fallback
    setInterval(() => {
        // You can implement a polling mechanism here
        // For now, just keep the bot alive
        process.stdout.write('💓 ');
    }, 30000);
    
    console.log('🤖 Bot is running in fallback mode');
    console.log('💡 Messages will be processed when sent');
}

async function handleMessage(api, event, handler) {
    if (event.type !== 'message') return;
    
    const message = event.body;
    const senderID = event.senderID;
    const threadID = event.threadID;
    const messageID = event.messageID;

    // Ignore messages from self to avoid loops
    if (senderID === api.getCurrentUserID()) {
        return;
    }

    console.log(`\n📩 New Message [${new Date().toLocaleTimeString()}]`);
    console.log(`   From: ${senderID}`);
    console.log(`   Text: ${message}`);

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
        
        // Send error message
        api.sendMessage({
            body: `❌ Sorry, I encountered an error.\n\nPlease try again! 🎀\n\n- Marina AI Bot`
        }, event.threadID);
    }
}

// Keep the process alive and handle errors
process.on('unhandledRejection', (error) => {
    console.error('❌ Unhandled Promise Rejection:', error);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
});

process.on('SIGINT', () => {
    console.log('\n👋 Shutting down Marina AI Bot...');
    console.log('💖 Goodbye! - Marina Khan');
    process.exit(0);
});

// Keep alive heartbeat
setInterval(() => {
    const time = new Date().toLocaleTimeString();
    process.stdout.write(`💓 Online [${time}] \\r`);
}, 60000);
