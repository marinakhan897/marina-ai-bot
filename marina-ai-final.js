// marina-ai-final.js - Marina AI Final Working Version
const aiEngine = require('./ai-engine-fixed.js');
const commandHandler = require('./command-handler.js');
const readline = require('readline');
const express = require('express');

console.log('🎀 MARINA AI BOT - FINAL VERSION');
console.log('✨ Created by: Marina Khan');
console.log('🤖 Powered by Google Gemini');
console.log('💬 Multi-Mode: Terminal + Web');
console.log('🕐', new Date().toLocaleString());
console.log('═'.repeat(50));

class MarinaAI {
    constructor() {
        this.handler = commandHandler.startBot();
        this.startMultiMode();
    }
    
    startMultiMode() {
        console.log('\n🚀 STARTING MARINA AI IN MULTI-MODE...');
        console.log('💫 Available Interfaces:');
        console.log('   1. 🌐 Web Interface (Port 3000)');
        console.log('   2. 💻 Terminal Chat');
        console.log('   3. 🤖 AI Commands');
        console.log('');
        
        // Start Web Interface
        this.startWebInterface();
        
        // Start Terminal Chat after 2 seconds
        setTimeout(() => {
            this.startTerminalChat();
        }, 2000);
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
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-family: Arial; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea, #764ba2); min-height: 100vh; }
                    .container { max-width: 800px; margin: 0 auto; background: white; border-radius: 15px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
                    .header { text-align: center; padding: 20px; background: linear-gradient(135deg, #ff6b6b, #ee5a52); color: white; border-radius: 10px; margin-bottom: 20px; }
                    .chat-box { height: 400px; border: 1px solid #ddd; padding: 15px; overflow-y: auto; margin: 20px 0; border-radius: 10px; }
                    .message { margin: 10px 0; padding: 12px; border-radius: 15px; max-width: 80%; }
                    .user { background: #1877f2; color: white; margin-left: auto; border-bottom-right-radius: 5px; }
                    .bot { background: #f0f2f5; margin-right: auto; border-bottom-left-radius: 5px; }
                    .input-area { display: flex; gap: 10px; }
                    input { flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 25px; font-size: 16px; }
                    button { background: #1877f2; color: white; border: none; padding: 12px 24px; border-radius: 25px; cursor: pointer; font-size: 16px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎀 Marina AI Bot</h1>
                        <p>Created by Marina Khan • Powered by Google Gemini</p>
                    </div>
                    <div class="chat-box" id="chat">
                        <div class="message bot">🤖 Hello! I'm Marina AI Bot. Chat with me using the input below! 💫</div>
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
        });
    }
    
    startTerminalChat() {
        console.log('✅ 💻 Terminal Chat: ACTIVE (type below)');
        console.log('💬 Type your message and press Enter:');
        console.log('─'.repeat(40));
        
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        function chat() {
            rl.question('👤 You: ', async (message) => {
                if (message.toLowerCase() === 'exit') {
                    console.log('\n🤖 Marina AI: Goodbye! Thank you for chatting! 💖');
                    console.log('✨ Created by Marina Khan');
                    rl.close();
                    return;
                }
                
                if (message.trim() === '') {
                    console.log('🤖 Marina AI: Please type a message!');
                    return chat();
                }
                
                console.log('🤖 Marina AI: Thinking...');
                
                try {
                    const response = await aiEngine.getAIResponse(message, 'terminal_user');
                    console.log('🤖 Marina AI:', response);
                } catch (error) {
                    console.log('🤖 Marina AI: ❌ Error:', error.message);
                }
                
                console.log('');
                chat();
            });
        }
        
        chat();
        
        rl.on('close', () => {
            console.log('\n💖 Thank you for using Marina AI Bot!');
        });
    }
}

// Start Marina AI
new MarinaAI();

// Keep alive
setInterval(() => {
    const time = new Date().toLocaleTimeString();
    process.stdout.write(`💓 Marina AI Online [${time}] \\r`);
}, 30000);
