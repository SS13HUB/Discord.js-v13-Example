
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
    console.log(chalkMy.exct, `Uncaught Exception: ${e}`);
});

process.on("unhandledRejection", (reason, promise) => {
    console.log(chalkMy.fatal, `Possibly Unhandled Rejection at: Promise ${promise} reason: ${reason.message}`);
});


process.on('SIGINT', () => {
    console.log(chalkMy.exit, `Caught interrupt signal.`);
    client.user.setStatus("invisible");
    /* client.guilds.cache.forEach(guild => {
        if (client.playerManager.get(guild)) client.playerManager.leave(guild);
    }); */
    process.exit();
});

process.on('SIGTERM', () => {
    console.log(chalkMy.exit, `Caught termination signal.`);
    client.user.setStatus("invisible");
    /* client.guilds.cache.forEach(guild => {
        if (client.playerManager.get(guild)) client.playerManager.leave(guild);
    }); */
    process.exit();
});

// Login Discord via Bot Token
client.login(process.env.TOKEN);
