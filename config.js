// config.js - Marina AI Bot Configuration
module.exports = {
    // Facebook Login Credentials
    email: "husnain.tonali.bhaiee@gmail.com",
    password: "pathani123",
    
    // AI API Configuration - CORRECT GEMINI SETTINGS
    AI_API_KEY: "sk-bddc91be67f34f42bc1e69c6010ac8ae",
    AI_PROVIDER: "DeepSeek",
    
    // Bot Settings
    BOT_NAME: "Marina AI",
    AUTO_RESPONSE: true,
    VERSION: "3.0.0",
    
    getBotInfo: function() {
        return {
            name: this.BOT_NAME,
            author: 'Marina Khan',
            version: this.VERSION,
            platform: 'Multi-Mode (Web + Terminal)',
            ai_provider: 'Google Gemini'
        };
    }
};
