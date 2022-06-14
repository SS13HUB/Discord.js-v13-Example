#!/usr/bin/env node
// -*- coding: utf-8 -*-

console.clear();
console.debug(`Booting up…`);

/// Declaring variables for 3rd side libs
const {
    Client,
    Collection,
    Intents
}                   = require('discord.js');
//const Discord       = require('discord.js');
const discordModals = require('discord-modals');

/* const { Permissions } = require('discord.js');
const fs = require('fs').promises;
const { MessageActionRow, MessageButton, Permissions, Formatters } = require('discord.js');
const { Modal, TextInputComponent, showModal } = require('discord-modals'); // Now we extract the showModal method
const { MessageButton, Permissions } = require('discord.js');
const { Formatters } = require('discord.js'); */

/// Declaring custom variables for local developments
//const handler = require(process.cwd() + "/handler/index");
//const chalkMy = require(process.cwd() + "/src/chalk");
//const path    = require("path");
//const process = require('process');
//const os      = require('os');

/// Declaring main var — client
const client = new Client({ intents: [
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

/// Global Variables
client.discord  = require('discord.js');
client.commands = new Collection();
client.slash    = new Collection();

client.cwd     = require('process').cwd(); // require('path').resolve(``);
client.config  = require(client.cwd + '/config');
client.handler = require(client.cwd + '/handler/index');
client.chalk   = require(client.cwd + '/src/chalk');

/// Call .env file to get Token
require('dotenv').config();

/// Enabling work with Modals
discordModals(client);


/// Exporting client data
module.exports = client;


/// Records commands and events
client.handler.loadEvents(client);
//client.handler.loadCommands(client);
client.handler.loadSlashCommands(client);


/// Error Handling
process.on("uncaughtException", (e) => {
    console.error(client.chalk.exct, `Uncaught Exception:`);
    console.error(e);
});

process.on("unhandledRejection", (reason, promise) => {
    console.error(client.chalk.fatal, `Possibly Unhandled Rejection:`);
    console.error(promise);
    console.error(reason);
    //console.error(`httpStatus: ${reason.httpStatus}, reason: ${reason.message}`);
    /// Below - detailing for "DiscordAPIError: Invalid Form Body"
    if (!reason.requestData) return;
    if (!reason.requestData["json"]) return;
    if (reason.code == 50035 || reason.message == "Invalid Form Body") {
        if (reason.requestData["json"] == []) return;
        if (!reason.requestData["json"][0].name || !reason.requestData["json"][0].description) return;
        for (let i = 0; i < reason.requestData["json"].length; i++) {
            let cmd  = reason.requestData["json"][i];
            let ii   = i < 10 ? ` ${i}`: i;
            let iii  = cmd.name.length < 10 ? ` ${cmd.name.length}`: cmd.name.length;
            let iiii = cmd.description.length < 100 ? cmd.description.length < 10 ? `  ${cmd.description.length}`: ` ${cmd.description.length}`: cmd.description.length;
            console.error(`[${ii}/${reason.requestData["json"].length - 1}] (${iii}/32;${iiii}/100) "${cmd.name}", "${cmd.description}"`);
        }
        //console.error(reason.requestData["json"]);
    } else {
        console.error(reason.requestData["json"]);
    }
});


/// Fancy login
async function clientLogin() {
    // Login into Discord via Bot Token
    console.log(client.chalk.log, `All preparations done, logging in…`);
    await client.login(process.env.TOKEN);
}
clientLogin();


/// Fancy shutdown
process.on('SIGINT', () => {
    console.log(client.chalk.exit, `Caught interrupt signal.`);
    /* try {
        client.user.setStatus("invisible");
    } catch (e) {
        console.log(client.chalk.fatal, `Can not set status.`);
    } */
    if (client.isReady()) client.user.setStatus("invisible");
    /* client.guilds.cache.forEach(guild => {
        if (client.playerManager.get(guild)) client.playerManager.leave(guild);
    }); */
    client.destroy();
    process.exit();
});

process.on('SIGTERM', () => {
    console.log(client.chalk.exit, `Caught termination signal.`);
    /* try {
        client.user.setStatus("invisible");
    } catch (e) {
        console.log(client.chalk.fatal, `Can not set status.`);
    } */
    if (client.isReady()) client.user.setStatus("invisible");
    /* client.guilds.cache.forEach(guild => {
        if (client.playerManager.get(guild)) client.playerManager.leave(guild);
    }); */
    client.destroy();
    process.exit();
});
