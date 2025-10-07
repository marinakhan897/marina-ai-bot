const axios = require('axios');
const fs = require('fs');
const path = require('path');

class CommandHandler {
    constructor() {
        this.commands = new Map();
        this.commandsPath = path.join(__dirname, 'commands');
        this.loadCommands();
    }

    loadCommands() {
        try {
            // Create commands directory if it doesn't exist
            if (!fs.existsSync(this.commandsPath)) {
                fs.mkdirSync(this.commandsPath, { recursive: true });
                console.log('📁 Created commands directory');
                return;
            }

            // Load all JavaScript files from commands directory
            const commandFiles = fs.readdirSync(this.commandsPath).filter(file => 
                file.endsWith('.js') && !file.startsWith('.')
            );

            console.log(`📂 Found ${commandFiles.length} command files`);

            for (const file of commandFiles) {
                try {
                    const commandPath = path.join(this.commandsPath, file);
                    const command = require(commandPath);
                    
                    if (command.config && command.config.name) {
                        this.commands.set(command.config.name, command);
                        console.log(`✅ Loaded command: ${command.config.name}`);
                    } else {
                        console.log(`⚠️  Skipping ${file}: Missing config or name`);
                    }
                } catch (error) {
                    console.error(`❌ Error loading command ${file}:`, error.message);
                }
            }

            console.log(`🎯 Total commands loaded: ${this.commands.size}`);
        } catch (error) {
            console.error('❌ Error loading commands:', error);
        }
    }

    async handleCommand(api, event, commandName, args) {
        const command = this.commands.get(commandName);
        if (!command) {
            return { success: false, error: `Command '${commandName}' not found` };
        }

        try {
            await command.onStart({ api, event, args });
            return { success: true };
        } catch (error) {
            console.error(`❌ Error executing command ${commandName}:`, error);
            return { success: false, error: error.message };
        }
    }

    getCommandList() {
        return Array.from(this.commands.keys());
    }

    getCommandInfo(commandName) {
        const command = this.commands.get(commandName);
        return command ? command.config : null;
    }
}

// Create and export instance
const commandHandler = new CommandHandler();

// Export functions for bot.js
module.exports = {
    startBot: function() {
        console.log('🤖 Marina AI Command Handler Started');
        console.log('✨ Created by: Marina Khan');
        return commandHandler;
    },
    handleCommand: commandHandler.handleCommand.bind(commandHandler),
    getCommandList: commandHandler.getCommandList.bind(commandHandler),
    getCommandInfo: commandHandler.getCommandInfo.bind(commandHandler)
};
