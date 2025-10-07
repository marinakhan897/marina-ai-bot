module.exports = {
    config: {
        name: "ai",
        version: "1.0.0", 
        author: "Marina Khan",
        countDown: 5,
        role: 0,
        description: "AI Chat Assistant",
        category: "ai",
        guide: { en: "{pn} [question]" }
    },

    onStart: async function ({ api, event, args }) {
        const question = args.join(" ");
        if (!question) {
            return api.sendMessage("💬 Please ask me a question!", event.threadID, event.messageID);
        }
        
        api.sendMessage(`🤖 AI Response for: "${question}"\n\nThis is where your AI engine will respond!`, event.threadID, event.messageID);
    }
};
