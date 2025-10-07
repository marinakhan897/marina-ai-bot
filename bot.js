// bot.js - Marina AI Bot - Complete Working Version
const login = require('@xaviabot/fca-unofficial');
const commandHandler = require('./command-handler.js');
const aiEngine = require('./ai-engine.js');
const express = require('express');

console.log('🎀 Marina AI Bot Starting...');
console.log('✨ Created by: Marina Khan');
console.log('🤖 Powered by Google Gemini');
console.log('💬 Multi-Mode: Facebook + Web + Terminal');
console.log('🕐', new Date().toLocaleString());

class MarinaAIBot {
    constructor() {
        this.isRunning = false;
        this.api = null;
        this.startBot();
    }

    async startBot() {
        try {
            console.log('\n🚀 Starting Marina AI Bot...');
            
            // Initialize command handler
            const handler = commandHandler.startBot();
            console.log('📋 Available commands:', handler.getCommandList());
            
            // Try Facebook login first
            await this.tryFacebookLogin(handler);
            
            // Also start web interface
            this.startWebInterface();
            
        } catch (error) {
            console.error('❌ Bot startup error:', error);
            this.startFallbackMode();
        }
    }

    async tryFacebookLogin(handler) {
        console.log('\n🔐 Attempting Facebook login...');
        
        // Your Facebook credentials - YAHAN APNA EMAIL PASSWORD DALO
        const credentials = {
            email: "Jodiye5028@cspaus.com",  // YAHAN APNA EMAIL DALO
            password: "pathani123"           // YAHAN APNA PASSWORD DALO
        };

        console.log('📧 Using email:', credentials.email);

        return new Promise((resolve) => {
            const loginOptions = {
                email: credentials.email,
                password: credentials.password,
                forceLogin: true,
                logLevel: 'silent'
            };

            login(loginOptions, (err, api) => {
                if (err) {
                    console.log('❌ Facebook login failed:', err.error);
                    console.log('💡 Starting Web Interface instead...');
                    resolve(false);
                    return;
                }

                console.log('✅ Facebook login successful!');
                console.log('👤 User ID:', api.getCurrentUserID());
                
                this.api = api;
                this.isRunning = true;
                
                // Save app state
                const appState = api.getAppState();
                require('fs').writeFileSync('appstate.json', JSON.stringify(appState, null, 2));
                console.log('💾 App state saved');
                
                // Send welcome message
                this.sendWelcomeMessage(api);
                
                // Start Facebook listener
                this.startFacebookListener(api, handler);
                
                resolve(true);
            });
        });
    }

    sendWelcomeMessage(api) {
        const welcomeMsg = `🤖 Marina AI Bot Activated! 🎀

✅ Login Successful
📧 Account: Jodiye5028@cspaus.com
🕐 ${new Date().toLocaleString()}
🤖 Powered by Google Gemini
💬 Auto-response: ENABLED

Send any message to test my AI! 💫

- Created by Marina Khan`;

        api.sendMessage(welcomeMsg, api.getCurrentUserID(), (err) => {
            if (err) {
                console.log('⚠️ Welcome message failed');
            } else {
                console.log('💌 Welcome message sent');
            }
        });
    }

    startFacebookListener(api, handler) {
        console.log('\n👂 Starting Facebook message listener...');
        
        api.setOptions({
            listenEvents: true,
            selfListen: false,
            logLevel: 'error'
        });

        api.listen((err, event) => {
            if (err) {
                console.log('❌ Listen error, using polling...');
                this.startFacebookPolling(api, handler);
                return;
            }
            
            this.handleFacebookMessage(api, event, handler);
        });

        console.log('💬 Facebook bot is now ACTIVE!');
        console.log('🤖 Send messages to your Facebook account');
    }

    startFacebookPolling(api, handler) {
        console.log('🔄 Starting message polling...');
        
        let lastCheck = Date.now();
        
        setInterval(() => {
            api.getThreadList(10, lastCheck, ['INBOX'], (err, threads) => {
                if (err) return;
                
                threads.forEach(thread => {
                    api.getThreadHistory(thread.threadID, 1, null, (err, history) => {
                        if (err || !history) return;
                        
                        const message = history[0];
                        if (message.senderID !== api.getCurrentUserID()) {
                            this.handleFacebookMessage(api, {
                                type: 'message',
                                body: message.body,
                                senderID: message.senderID,
                                threadID: thread.threadID,
                                messageID: message.messageID
                            }, handler);
                        }
                    });
                });
                lastCheck = Date.now();
            });
        }, 10000);
    }

    async handleFacebookMessage(api, event, handler) {
        if (event.type !== 'message' || !event.body) return;
        if (event.senderID === api.getCurrentUserID()) return;
        
        const message = event.body;
        const threadID = event.threadID;
        
        console.log(`\n📩 Facebook Message:`);
        console.log(`   From: ${event.senderID}`);
        console.log(`   Text: ${message}`);
        
        // Mark as read
        api.markAsRead(threadID, () => {});
        
        // Show typing
        api.sendTypingIndicator(threadID, () => {});
        
        try {
            let response;
            
            if (message.startsWith('.') || message.startsWith('!')) {
                const commandText = message.slice(1).trim();
                const [commandName, ...args] = commandText.split(' ');
                console.log(`   🔍 Command: ${commandName}`);
                
                const result = await handler.handleCommand(api, event, commandName, args);
                if (!result.success) {
                    response = `❌ ${result.error}\n\nUse .help for commands`;
                }
            } else {
                console.log('   🤖 Getting AI response...');
                response = await aiEngine.getAIResponse(message, event.senderID);
                console.log('   ✅ Response ready');
            }
            
            if (response) {
                api.sendMessage({ body: response }, threadID, (err) => {
                    if (err) {
                        console.log('   ❌ Send failed');
                    } else {
                        console.log('   💌 Response sent!');
                    }
                });
            }
            
        } catch (error) {
            console.error('   ❌ Error:', error.message);
        }
    }

    startWebInterface() {
        const app = express();
        const PORT = 3000;
        
        app.use(express.json());
        
        app.get('/', (req, res) => {
            res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Marina AI Bot</title>
                <style>
                    body { font-family: Arial; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea, #764ba2); min-height: 100vh; }
                    .container { max-width: 800px; margin: 0 auto; background: white; border-radius: 15px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
                    .header { text-align: center; padding: 20px; background: linear-gradient(135deg, #ff6b6b, #ee5a52); color: white; border-radius: 10px; margin-bottom: 20px; }
                    .chat-box { height: 400px; border: 1px solid #ddd; padding: 15px; overflow-y: auto; margin: 20px 0; border-radius: 10px; }
                    .message { margin: 10px 0; padding: 12px; border-radius: 15px; max-width: 80%; }
                    .user { background: #1877f2; color: white; margin-left: auto; }
                    .bot { background: #f0f2f5; margin-right: auto; }
                    .input-area { display: flex; gap: 10px; }
                    input { flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 25px; }
                    button { background: #1877f2; color: white; border: none; padding: 12px 24px; border-radius: 25px; cursor: pointer; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎀 Marina AI Bot</h1>
                        <p>Created by Marina Khan • Powered by Google Gemini</p>
                    </div>
                    <div class="chat-box" id="chat">
                        <div class="message bot">🤖 Hello! I'm Marina AI Bot. Chat with me below! 💫</div>
                    </div>
                    <div class="input-area">
                        <input type="text" id="messageInput" placeholder="Type your message..." autocomplete="off">
                        <button onclick="sendMessage()">Send</button>
                    </div>
                </div>
                <script>
                    async function sendMessage() {
                        const input = document.getElementById('messageInput');
                        const message = input.value.trim();
                        if (!message) return;
                        
                        const chat = document.getElementById('chat');
                        chat.innerHTML += '<div class="message user">' + message + '</div>';
                        input.value = '';
                        chat.scrollTop = chat.scrollHeight;
                        
                        const response = await fetch('/chat', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({message: message})
                        });
                        
                        const data = await response.json();
                        chat.innerHTML += '<div class="message bot">' + data.response.replace(/\\n/g, '<br>') + '</div>';
                        chat.scrollTop = chat.scrollHeight;
                    }
                    document.getElementById('messageInput').addEventListener('keypress', function(e) {
                        if (e.key === 'Enter') sendMessage();
                    });
                </script>
            </body>
            </html>
            `);
        });
        
        app.post('/chat', async (req, res) => {
            const { message } = req.body;
            console.log('🌐 Web Chat:', message);
            try {
                const response = await aiEngine.getAIResponse(message, 'web_user');
                res.json({ response: response });
            } catch (error) {
                res.json({ response: '❌ Error: ' + error.message });
            }
        });
        
        app.listen(PORT, () => {
            console.log('✅ 🌐 Web Interface: http://localhost:' + PORT);
            console.log('💡 Open in browser to chat!');
        });
    }

    startFallbackMode() {
        console.log('\n🔄 Starting in Fallback Mode...');
        console.log('💬 You can use Web Interface at: http://localhost:3000');
        console.log('🤖 AI Features: ACTIVE');
        console.log('🎀 Created by: Marina Khan');
    }
}

// Start the bot
new MarinaAIBot();

// Keep alive
setInterval(() => {
    const time = new Date().toLocaleTimeString();
    process.stdout.write(`💓 Marina AI Online [${time}] \\r`);
}, 30000);

process.on('SIGINT', () => {
    console.log('\n👋 Shutting down Marina AI Bot...');
    console.log('💖 Goodbye! - Marina Khan');
    process.exit(0);
});
