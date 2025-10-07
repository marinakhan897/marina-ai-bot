// ai-engine-fixed.js - Marina AI Engine with Correct Gemini API
const axios = require('axios');
const config = require('./config.js');

class AIEngine {
    constructor() {
        this.apiKey = config.AI_API_KEY;
        this.provider = config.AI_PROVIDER || 'gemini';
        // CORRECT Gemini API endpoints
        this.geminiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
        this.geminiProUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${this.apiKey}`;
        console.log(`🤖 AI Engine Initialized: ${this.provider}`);
    }

    async getAIResponse(message, userId) {
        try {
            console.log(`🤖 Processing: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`);
            
            // Try Gemini 1.5 Flash first (latest model)
            if (this.apiKey && this.apiKey !== 'your-api-key-here') {
                try {
                    const response = await this.callGeminiFlash(message);
                    return response;
                } catch (flashError) {
                    console.log('   🔄 Gemini Flash failed, trying Pro...');
                    try {
                        const response = await this.callGeminiPro(message);
                        return response;
                    } catch (proError) {
                        console.log('   🔄 Gemini Pro failed, using default response');
                        return this.getDefaultResponse(message);
                    }
                }
            } else {
                return this.getDefaultResponse(message);
            }

        } catch (error) {
            console.error('❌ AI Engine error:', error.message);
            return this.getDefaultResponse(message);
        }
    }

    async callGeminiFlash(message) {
        const response = await axios.post(
            this.geminiUrl,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: `You are Marina AI, a friendly and helpful assistant created by Marina Khan. You're chatting with a user. Respond in a warm, conversational tone. Keep responses under 200 words.

User: ${message}`
                            }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 250,
                    topP: 0.8,
                    topK: 40
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 15000
            }
        );

        if (response.data && response.data.candidates && response.data.candidates[0]) {
            const aiText = response.data.candidates[0].content.parts[0].text;
            console.log('   ✅ Gemini 1.5 Flash response received');
            return `🤖 ${aiText}\n\n💖 *Marina AI Bot* • Powered by Google Gemini • Created by Marina Khan`;
        } else {
            throw new Error('Invalid response from Gemini');
        }
    }

    async callGeminiPro(message) {
        const response = await axios.post(
            this.geminiProUrl,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: `You are Marina AI assistant created by Marina Khan. Be helpful and friendly. Respond conversationally.

User: ${message}`
                            }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 200
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 15000
            }
        );

        if (response.data && response.data.candidates && response.data.candidates[0]) {
            const aiText = response.data.candidates[0].content.parts[0].text;
            console.log('   ✅ Gemini Pro response received');
            return `🤖 ${aiText}\n\n✨ *Marina AI* • Google Gemini • By Marina Khan`;
        } else {
            throw new Error('Invalid response from Gemini Pro');
        }
    }

    getDefaultResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return `👋 Hello! I'm Marina AI Bot! 💫\n\nI was created by Marina Khan to assist you with anything you need! How can I help you today? ✨\n\nTry these commands:\n• .help - Show all commands\n• .banner - Create beautiful banners\n• Or just chat with me!`;
        }
        else if (lowerMessage.includes('how are you')) {
            return `🤖 I'm doing absolutely wonderful! Thanks for asking! 💖\n\nAs Marina Khan's AI assistant, I'm always here to help you with anything you need! What would you like to talk about today?`;
        }
        else if (lowerMessage.includes('your name') || lowerMessage.includes('who are you')) {
            return `🎀 I'm Marina AI Bot! Created by the amazing Marina Khan! 💫\n\nI'm your friendly AI assistant powered by advanced AI technology. I can help you with conversations, create beautiful banners, answer questions, and much more!\n\nBuilt with love by Marina Khan! 💖`;
        }
        else if (lowerMessage.includes('help') || lowerMessage.includes('command')) {
            return `🤖 **Marina AI Bot Help** 🎀\n\n✨ **Available Commands:**\n• .ai [question] - Chat with AI\n• .banner [text] - Create beautiful banners\n• .help - Show this help\n\n💫 **Features:**\n• Smart conversations\n• Banner creation\n• Question answering\n• Friendly assistance\n\n💖 **Created by:** Marina Khan\n🔧 **AI:** Google Gemini\n🎯 **Status:** Fully Operational`;
        }
        else if (lowerMessage.includes('thank')) {
            return `💖 You're absolutely welcome! I'm always happy to help you! 🎀\n\nIf you need anything else, just let me know! I'm here for you 24/7!\n\n- Marina AI Bot by Marina Khan`;
        }
        else if (lowerMessage.includes('marina') || lowerMessage.includes('creator')) {
            return `✨ Yes! I was created by Marina Khan - she's an incredible developer! 🎀\n\nShe built me using the latest AI technology to create a helpful, friendly assistant that can chat, create banners, answer questions, and keep you company!\n\nAll thanks to Marina Khan! 💖`;
        }
        else if (lowerMessage.includes('time')) {
            return `🕐 Current Date & Time: ${new Date().toLocaleString()}\n\n📅 ${new Date().toDateString()}\n⏰ ${new Date().toLocaleTimeString()}\n\nTime flies when we're having fun chatting! 💫`;
        }
        else if (lowerMessage.includes('joke')) {
            const jokes = [
                "🤣 Why don't scientists trust atoms? Because they make up everything!",
                "😂 Why did the AI cross the road? To optimize the other side!",
                "😄 What's a computer's favorite snack? Microchips!",
                "🎭 Why don't AIs play hide and seek? Good luck hiding in the cloud!",
                "💫 Why was the math book sad? It had too many problems!"
            ];
            return jokes[Math.floor(Math.random() * jokes.length)] + "\n\n😊 Hope that made you smile!";
        }
        else if (lowerMessage.includes('love') || lowerMessage.includes('like you')) {
            return `💕 Aww, thank you! You're amazing too! 💖\n\nI really enjoy our conversations! I'm here whenever you need someone to talk to or help with anything at all!`;
        }
        else if (lowerMessage.includes('what can you do')) {
            return `🎯 **Here's what I can do:**\n\n💬 **Chat & Conversations**\n• Have friendly conversations\n• Answer questions\n• Tell jokes and stories\n\n🎨 **Creative Tasks**\n• Create beautiful banners (.banner)\n• Generate creative content\n• Help with ideas\n\n🔧 **Utilities**\n• Provide information\n• Help with tasks\n• Keep you company\n\n💖 **And much more!** Just ask!`;
        }
        else {
            const randomResponses = [
                `🤖 Hello! I'm Marina AI Bot! You said: "${message}"\n\nI'm here to help you with chatting, creating banners, answering questions, or just keeping you company! 💫\n\nTry saying "hello" or using .help for commands!`,
                `💫 Thanks for your message! I'm Marina AI created by Marina Khan. How can I assist you today? 🎀\n\nI can help with conversations, banner creation, questions, and more!`,
                `🎀 Hey there! You mentioned: "${message}"\n\nI'm Marina AI Bot - your friendly assistant! I'm here to help with anything you need! ✨\n\nUse .help to see all my features!`,
                `💖 Hello! I'm Marina AI! You said: "${message}"\n\nI can chat with you, create banners, answer questions, and be your helpful assistant! 🎯\n\nWhat would you like to do today?`
            ];
            return randomResponses[Math.floor(Math.random() * randomResponses.length)];
        }
    }
}

// Create and export instance
const aiEngine = new AIEngine();
module.exports = aiEngine;
