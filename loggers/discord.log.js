"use strict";

const { Client, GatewayIntentBits } = require("discord.js");

const { TOKEN_DISCORD, CHANNELID_DISCORD } = process.env;
class LoggerService {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
        });
        //add channelId
        this.channelId = CHANNELID_DISCORD;

        this.client.on("ready", () => {
            console.log(`Logged is as ${this.client.user.tag}!`);
        });

        this.client.login(TOKEN_DISCORD);
    }
    // định dạng lại code tc khi gửi
    sendToFormatCode(logData) {
        const {
            code,
            message = "this is some additional information about the code.",
            title = "Code Example",
        } = logData;

        const codeMessage = {
            content: message,
            embeds: [
                {
                    color: parseInt("00ff00", 16), // convert hex color code to integer
                    title,
                    description:
                        "```json\n" + JSON.stringify(code, null, 2) + "\n```",
                },
            ],
        };

        this.sendToMessage(codeMessage);
    }

    // gửi info lên discord
    sendToMessage(message = "message") {
        const channel = this.client.channels.cache.get(this.channelId);
        if (!channel) {
            console.error("Could not find channel...", this.channelId);
            return;
        }

        channel.send(message).catch((e) => console.error(e));
    }
}

module.exports = new LoggerService();
