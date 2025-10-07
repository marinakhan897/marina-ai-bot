// simple-messenger.js - Marina AI Simple Messenger
const commandHandler = require('./command-handler.js');
const aiEngine = require('./ai-engine.js');
const fs = require('fs');

console.log('🎀 Marina AI Simple Messenger');
console.log('✨ Created by: Marina Khan');
console.log('🤖 AI: Google Gemini');
console.log('📧 Account: 61578578084055');
console.log('🕐', new Date().toLocaleString());

class SimpleMessenger {
    constructor() {
        this.handler = commandHandler.startBot();
        console.log('📋 Commands:', this.handler.getCommandList());
        console.log('\n🚀 Marina AI is READY!');
        console.log('💬 Features:');
        console.log('   • Google Gemini AI Responses');
        console.log('   • Banner Creation Commands');
        console.log('   • Auto-response System');
        console.log('   • Smart Conversations');
        console.log('\n🔧 To add Facebook Messenger:');
        console.log('   Install: npm install @xaviabot/fca-unofficial');
        console.log('   Then run: node facebook-bot.js');
    }

    start() {
        this.testAI();
        this.keepAlive();
    }

    async testAI() {
        console.log('\n🧪 Testing AI Responses...\n');
        
        const testMessages = [
            "Hello Marina AI!",
            "How are you today?",
            "Who created you?",
            "What can you do?",
            "Tell me a joke"
        ];

        for (const message of testMessages) {
            console.log(`👤 User: ${message}`);
            const response = await aiEngine.getAIResponse(message, 'test_user');
            console.log(`🤖 AI: ${response.substring(0, 100)}...`);
            console.log('─'.repeat(50));
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        console.log('\n🎉 Marina AI Bot is WORKING PERFECTLY!');
        console.log('💖 Created by: Marina Khan');
    }

    keepAlive() {
        setInterval(() => {
            const time = new Date().toLocaleTimeString();
            process.stdout.write(`💓 Marina AI Online [${time}] \\r`);
        }, 30000);
    }
}

// Start the bot
const bot = new SimpleMessenger();
bot.start();

process.on('SIGINT', () => {
    console.log('\n\n👋 Shutting down...');
    console.log('💖 Goodbye! - Marina Khan');
    process.exit(0);
});
