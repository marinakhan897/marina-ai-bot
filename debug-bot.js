// debug-bot.js - Marina AI Debug Bot
const login = require('@xaviabot/fca-unofficial');
const commandHandler = require('./command-handler.js');
const aiEngine = require('./ai-engine.js');
const fs = require('fs');

console.log('🎀 Marina AI Debug Bot Starting...');
console.log('✨ Created by: Marina Khan');
console.log('🕐', new Date().toLocaleString());

// Load appstate
const appState = JSON.parse(fs.readFileSync('appstate.json', 'utf8'));

login({ appState }, (err, api) => {
    if (err) {
        console.error('❌ Login failed:', err);
        return;
    }

    console.log('✅ Logged in as:', api.getCurrentUserID());
    const handler = commandHandler.startBot();
    
    console.log('\n🔍 DEBUG MODE: Checking thread access...');
    
    // Test if we can access threads
    api.getThreadList(5, null, ['INBOX'], (err, threads) => {
        if (err) {
            console.error('❌ Cannot get threads:', err);
            return;
        }
        
        console.log('✅ Can access threads! Found:', threads.length);
        
        threads.forEach(thread => {
            console.log(`   💬 ${thread.name || 'Unknown'} (${thread.threadID}) - ${thread.lastMessage}`);
        });
        
        console.log('\n🚀 Starting message monitoring...');
        startMonitoring(api, handler);
    });
});

function startMonitoring(api, handler) {
    console.log('👀 Monitoring messages every 3 seconds...');
    console.log('💡 Send a message to yourself on Facebook');
    console.log('📱 I will detect and respond immediately\n');
    
    let lastCheck = Date.now();
    
    setInterval(() => {
        checkForNewMessages(api, handler, lastCheck);
        lastCheck = Date.now();
    }, 3000);
}

function checkForNewMessages(api, handler, sinceTime) {
    api.getThreadList(10, sinceTime, ['INBOX'], (err, threads) => {
        if (err) {
            console.log('⚠️ Thread check error (normal):', err.error);
            return;
        }
        
        if (threads.length > 0) {
            console.log(`🆕 New activity detected: ${threads.length} threads`);
            
            threads.forEach(thread => {
                // Get the latest message from this thread
                api.getThreadHistory(thread.threadID, 1, null, (err, history) => {
                    if (err || !history || history.length === 0) return;
                    
                    const message = history[0];
                    
                    // Skip if message is from bot itself or before our check time
                    if (message.senderID === api.getCurrentUserID() || message.timestamp < sinceTime) {
                        return;
                    }
                    
                    console.log(`\n🎯 NEW MESSAGE DETECTED!`);
                    console.log(`   Thread: ${thread.name || thread.threadID}`);
                    console.log(`   From: ${message.senderID}`);
                    console.log(`   Message: ${message.body}`);
                    console.log(`   Time: ${new Date(message.timestamp).toLocaleTimeString()}`);
                    
                    // Process this message
                    processMessage(api, handler, {
                        body: message.body,
                        senderID: message.senderID,
                        threadID: thread.threadID,
                        messageID: message.messageID,
                        timestamp: message.timestamp
                    });
                });
            });
        }
    });
}

async function processMessage(api, handler, event) {
    try {
        console.log('   🤖 Processing message...');
        
        // Mark as read
        api.markAsRead(event.threadID, (err) => {
            if (err) console.log('   ⚠️ Mark as read failed');
        });
        
        // Show typing
        api.sendTypingIndicator(event.threadID, (err) => {
            if (err) console.log('   ⚠️ Typing failed');
        });
        
        let response;
        
        if (event.body.startsWith('.') || event.body.startsWith('!')) {
            // Handle command
            const commandText = event.body.slice(1).trim();
            const [commandName, ...args] = commandText.split(' ');
            console.log(`   🔍 Command detected: ${commandName}`);
            
            const result = await handler.handleCommand(api, event, commandName, args);
            if (!result.success) {
                response = `❌ ${result.error}\n\nUse .help for available commands`;
            }
        } else {
            // AI response
            console.log('   🧠 Getting AI response...');
            response = await aiEngine.getAIResponse(event.body, event.senderID);
            console.log('   ✅ AI response ready');
        }
        
        if (response) {
            console.log('   📤 Sending response...');
            api.sendMessage({ body: response }, event.threadID, (err, msgInfo) => {
                if (err) {
                    console.log('   ❌ Send failed:', err);
                } else {
                    console.log('   💌 Response sent successfully!');
                    console.log('   📝 Response preview:', response.substring(0, 50) + '...');
                }
            });
        }
        
    } catch (error) {
        console.error('   💥 Processing error:', error);
    }
}

// Keep alive
setInterval(() => {
    const time = new Date().toLocaleTimeString();
    process.stdout.write(`💓 Monitoring... [${time}] \\r`);
}, 10000);

process.on('SIGINT', () => {
    console.log('\n\n👋 Shutting down debug bot...');
    process.exit(0);
});
