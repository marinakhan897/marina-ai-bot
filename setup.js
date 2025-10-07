const readline = require('readline');
const { ConfigManager } = require('./config.js');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('╔══════════════════════════════════════╗');
console.log('║           🤖 MARINA AI BOT          ║');
console.log('║           SETUP WIZARD              ║');
console.log('╚══════════════════════════════════════╝');
console.log('');

function startSetup() {
    console.log('📝 Bot Setup Required');
    console.log('─────────────────────');
    
    rl.question('🔑 Enter your Gemini API Key: ', (apiKey) => {
        const trimmedKey = apiKey.trim();
        
        if (!trimmedKey) {
            console.log('❌ API key is required!');
            startSetup();
            return;
        }

        rl.question('🤖 Enter bot name [MarinaAI]: ', (botName) => {
            const finalBotName = botName.trim() || 'MarinaAI';
            
            if (ConfigManager.saveConfig(trimmedKey, finalBotName)) {
                console.log('');
                console.log('🎉 SETUP COMPLETED SUCCESSFULLY!');
                console.log('────────────────────────────────');
                console.log(`🤖 Bot Name: ${finalBotName}`);
                console.log(`🔐 API Key: •••••${trimmedKey.slice(-8)}`);
                console.log(`📁 Config: ai-config.json`);
                console.log('');
                console.log('🚀 Starting your AI bot...');
                console.log('');
                
                setTimeout(() => {
                    require('./bot.js');
                }, 3000);
            } else {
                console.log('❌ Setup failed! Please try again.');
            }
            
            rl.close();
        });
    });
}

// Start setup
startSetup();
