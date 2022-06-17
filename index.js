#!/usr/bin/env node
// -*- coding: utf-8 -*-

console.clear();
console.debug(`Booting up…`);

/// Declaring variables for 3rd side libs
const _discord_js = require('discord.js');
const {
    Client,
    Collection,
    Intents
}                   = _discord_js
//const Discord       = require('discord.js');
const discordModals = require('discord-modals');
const path          = require('path');
const dotenv        = require('dotenv');

/* const { Permissions } = require('discord.js');
const fs = require('fs').promises;
const { MessageActionRow, MessageButton, Permissions, Formatters } = require('discord.js');
const { Modal, TextInputComponent, showModal } = require('discord-modals'); // Now we extract the showModal method
const { MessageButton, Permissions } = require('discord.js');
const { Formatters } = require('discord.js'); */

/// Declaring custom variables for local developments
//const handler = require(process.cwd() + '\\handler\\index');
//const chalkMy = require(process.cwd() + '\\src\\chalk');
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
] });

/// Custom Global Variables
client.g = {};
client.g.discord  = _discord_js;
client.g.cmds = {};
client.g.cmds.legacy = new Collection();
client.g.cmds.slash  = new Collection();

client.g.cwd      = require('process').cwd(); // require('path').resolve(``);
client.g.handlers = {
    OS: {
        eventsProcess: require(client.g.cwd + '\\src\\handlers\\OS\\process\\eventsProcess'),
    },
    Discord: {
        eventsDiscord: require(client.g.cwd + '\\src\\handlers\\Discord\\eventsDiscord'),
        cmdsSlash:     require(client.g.cwd + '\\src\\handlers\\Discord\\cmdsSlash'),
        cmdsLegacy:    require(client.g.cwd + '\\src\\handlers\\Discord\\cmdsLegacy')
    }
};
//client.handler = require(client.g.cwd + '\\handlers\\index');

//client.g.config.verbose = Boolean(0);
//client.g.config.debug   = Boolean(0);

/// Call .env file to get Token
const result = dotenv.config({ debug: Boolean( 0 ),  path: path.resolve(client.g.cwd, '.env') });
if (result.error) throw result.error;

/// Enabling work with Modals
discordModals(client);


/// Exporting client data
module.exports = client;
client.g.config = require(client.g.cwd + '\\config');
client.g.chalk  = require(client.g.cwd + '\\src\\custom\\chalk');

/// Records commands and events
//client.g.handlers.OS.eventsProcess.load(client); // ToDo: BROKEN, DO NOT USE
client.g.handlers.Discord.eventsDiscord.load(client);
client.g.handlers.Discord.cmdsLegacy.load(client);
client.g.handlers.Discord.cmdsSlash.load(client);


/// Error Handling
process.on('uncaughtException', (e) => {
    console.error(client.g.chalk.exct, `Uncaught Exception:`);
    console.error(e);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error(client.g.chalk.fatal, `Possibly Unhandled Rejection:`);
    console.error(promise);
    console.error(reason);
    //console.error(`httpStatus: ${reason.httpStatus}, reason: ${reason.message}`);
    /// Below - detailing for 'DiscordAPIError: Invalid Form Body'
    if (!reason.requestData) return;
    if (!reason.requestData['json']) return;
    if (reason.code == 50035 || reason.message == 'Invalid Form Body') {
        if (reason.requestData['json'] == []) return;
        if (!reason.requestData['json'][0].name || !reason.requestData['json'][0].description) return;
        for (let i = 0; i < reason.requestData['json'].length; i++) {
            let cmd  = reason.requestData['json'][i];
            let ii   = i < 10 ? ` ${i}`: i;
            let iii  = cmd.name.length < 10 ? ` ${cmd.name.length}`: cmd.name.length;
            let iiii = cmd.description.length < 100 ? cmd.description.length < 10 ? `  ${cmd.description.length}`: ` ${cmd.description.length}`: cmd.description.length;
            console.error(`[${ii}/${reason.requestData['json'].length - 1}] (${iii}/32;${iiii}/100) '${cmd.name}', '${cmd.description}'`);
        }
        //console.error(reason.requestData['json']);
    } else {
        console.error(reason.requestData['json']);
    }
});


/// Fancy shutdown
process.on('SIGINT', () => {
    console.log(client.g.chalk.exit, `Caught interrupt signal.`);
    /* try {
        client.user.setStatus('invisible');
    } catch (e) {
        console.log(client.g.chalk.fatal, `Can not set status.`);
    } */
    if (client.isReady()) client.user.setStatus('invisible');
    /* client.guilds.cache.forEach(guild => {
        if (client.playerManager.get(guild)) client.playerManager.leave(guild);
    }); */
    client.destroy();
    process.exit();
});

process.on('SIGTERM', () => {
    console.log(client.g.chalk.exit, `Caught termination signal.`);
    /* try {
        client.user.setStatus('invisible');
    } catch (e) {
        console.log(client.g.chalk.fatal, `Can not set status.`);
    } */
    if (client.isReady()) client.user.setStatus('invisible');
    /* client.guilds.cache.forEach(guild => {
        if (client.playerManager.get(guild)) client.playerManager.leave(guild);
    }); */
    client.destroy();
    process.exit();
});


/// Fancy login
async function clientLogin() {
    // Login into Discord via Bot Token
    console.log(client.g.chalk.log, `All preparations done, logging in…`);
    await client.login(process.env.TOKEN);
}
clientLogin();

