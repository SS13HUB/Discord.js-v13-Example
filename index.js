
const { Client, Collection, Intents } = require('discord.js');
const Discord = require('discord.js');
const discordModals = require('discord-modals');

const handler = require("./handler/index");
const chalkMy = require("./src/chalk");

const client = new Client({
    intents: [  
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_WEBHOOKS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING,
    ],
});

discordModals(client);

// Call .env file to get Token
require('dotenv').config();

module.exports = client;

// Global Variables
client.discord = Discord;
client.commands = new Collection();
client.slash = new Collection();
client.config = require('./config');

// Records commands and events
handler.loadEvents(client);
//handler.loadCommands(client);
handler.loadSlashCommands(client);

// Error Handling

process.on("uncaughtException", (e) => {
    console.log(chalkMy.exct, `Uncaught Exception:`);
    console.log(e);
});

process.on("unhandledRejection", (reason, promise) => {
    console.log(chalkMy.fatal, `Possibly Unhandled Rejection:`);
    console.log(promise);
    console.log(reason);
    //console.log(`httpStatus: ${reason.httpStatus}, reason: ${reason.message}`);
    // ↓ for "DiscordAPIError: Invalid Form Body"
    if (reason.code == 50035 || reason.message == "Invalid Form Body") {
        if (!reason.requestData) return;
        if (!reason.requestData["json"]) return;
        if (reason.requestData["json"] == []) return;
        if (!reason.requestData["json"][0].name || !reason.requestData["json"][0].description) return;
        for (let i = 0; i < reason.requestData["json"].length; i++) {
            let cmd  = reason.requestData["json"][i];
            let ii   = i < 10 ? ` ${i}`: i;
            let iii  = cmd.name.length < 10 ? ` ${cmd.name.length}`: cmd.name.length;
            let iiii = cmd.description.length < 100 ? cmd.description.length < 10 ? `  ${cmd.description.length}`: ` ${cmd.description.length}`: cmd.description.length;
            console.log(`[${ii}/${reason.requestData["json"].length - 1}] (${iii}/32;${iiii}/100) "${cmd.name}", "${cmd.description}"`);
        }
        //console.log(reason.requestData["json"]);
    }
});


process.on('SIGINT', () => {
    console.log(chalkMy.exit, `Caught interrupt signal.`);
    if (client !== undefined) client.user.setStatus("invisible");
    /* client.guilds.cache.forEach(guild => {
        if (client.playerManager.get(guild)) client.playerManager.leave(guild);
    }); */
    process.exit();
});

process.on('SIGTERM', () => {
    console.log(chalkMy.exit, `Caught termination signal.`);
    if (client !== undefined) client.user.setStatus("invisible");
    /* client.guilds.cache.forEach(guild => {
        if (client.playerManager.get(guild)) client.playerManager.leave(guild);
    }); */
    process.exit();
});

// Login Discord via Bot Token
client.login(process.env.TOKEN);
