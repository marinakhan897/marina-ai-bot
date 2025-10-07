// simple-bot.js - HTTP Based AI Bot
const express = require('express');
const axios = require('axios');
const commandHandler = require('./command-handler.js');
const aiEngine = require('./ai-engine.js');

const app = express();
app.use(express.json());

console.log('🎀 Marina HTTP Bot Starting...');
console.log('✨ Created by: Marina Khan');

app.post('/webhook', async (req, res) => {
    const { message, sender, platform } = req.body;
    
    console.log(`📩 ${platform} Message from ${sender}: ${message}`);
    
    // AI response generate karo
    const response = await aiEngine.getAIResponse(message, sender);
    
    console.log(`🤖 Response: ${response}`);
    
    res.json({ 
        success: true, 
        response: response,
        bot: "Marina AI",
        author: "Marina Khan"
    });
});

app.get('/', (req, res) => {
    res.json({
        bot: "Marina AI Bot",
        status: "Running",
        author: "Marina Khan",
        version: "2.0.0"
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🤖 Marina AI Bot running on port ${PORT}`);
    console.log(`🌐 Webhook URL: http://localhost:${PORT}/webhook`);
});

module.exports = app;
