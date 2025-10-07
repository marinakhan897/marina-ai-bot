const axios = require('axios');

module.exports = {
    config: {
        name: "banner",
        version: "2.0.0",
        author: "Marina Khan",
        countDown: 5,
        role: 0,
        description: "Create stunning banners with multiple styles",
        category: "media",
        guide: {
            en: "{pn} [text] | [style] | [background]"
        }
    },

    onStart: async function ({ api, event, args }) {
        try {
            const threadID = event.threadID;
            const messageID = event.messageID;
            
            if (!args || args.length === 0) {
                return api.sendMessage(
                    `🎨 **Marina's Banner Creator** 🎨\n\n` +
                    `✨ Available Styles: 1-20\n\n` +
                    `💡 Usage: .banner text | style | background\n` +
                    `Example: .banner Marina | 3 | blue\n\n` +
                    `🎀 Created by: Marina Khan`,
                    threadID,
                    messageID
                );
            }

            api.sendMessage("🔄 Creating your beautiful banner... Please wait! 💫", threadID, messageID);
            
            // Simulate banner creation (replace with your actual banner API)
            setTimeout(() => {
                api.sendMessage({
                    body: `🎨 **Your Banner is Ready!** 🎨\n\n📝 Text: ${args.join(" ")}\n🎭 Style: Custom\n🌈 Background: Dynamic\n\n💖 Created by Marina Khan`,
                    attachment: null // You can add actual image attachment here
                }, threadID, messageID);
            }, 3000);
            
        } catch (error) {
            console.error("Banner error:", error);
            api.sendMessage("❌ Error creating banner. Please try again! 🎀", event.threadID, event.messageID);
        }
    }
};
