
const fs = require("fs");
const chalkMy = require("./../src/chalk");

/**
 * Load Events
 */
const loadEvents = async function (client) {
    const eventFolders = fs.readdirSync("./events");
    for (const folder of eventFolders) {
        const eventFiles = fs
        .readdirSync(`./events/${folder}`)
        .filter((file) => file.endsWith(".js"));
        
        for (const file of eventFiles) {
            const event = require(`../events/${folder}/${file}`);
            
            if (event.name) {
                console.log(chalkMy.log, chalkMy.ok, `Event is being loaded: "${file}"`);
            } else {
                console.log(chalkMy.log, chalkMy.err, `Event missing a help.name or help.name is not in string: "${file}"`);
                continue;
            }
            
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        }
    }
}

/**
 * Load Prefix Commands
 */
/* const loadCommands = async function (client) {
    const commandFolders = fs.readdirSync("./commands");
    for (const folder of commandFolders) {
        const commandFiles = fs
            .readdirSync(`./commands/${folder}`)
            .filter((file) => file.endsWith(".js"));
        
        for (const file of commandFiles) {
            const command = require(`../commands/${folder}/${file}`);
            
            if (command.name) {
                client.commands.set(command.name, command);
                console.log(chalkMy.log, chalkMy.ok, `Prefix Command is being loaded: "${file}"`);
            } else {
                console.log(chalkMy.log, chalkMy.err, `Prefix Command missing a help.name or help.name is not in string: "${file}"`);
                continue;
            }
            
            if (command.aliases && Array.isArray(command))
                command.aliases.forEach((alias) => client.aliases.set(alias, command.name));
        }
    }
} */

/**
 * Load SlashCommands
 */
const loadSlashCommands = async function (client) {
    let slash = [];

    const commandFolders = fs.readdirSync("./slashCommands");
    for (const folder of commandFolders) {
        const commandFiles = fs
            .readdirSync(`./slashCommands/${folder}`)
            .filter((file) => file.endsWith(".js"));
        
        for (const file of commandFiles) {
            const command = require(`../slashCommands/${folder}/${file}`);
            
            if (command.name) {
                client.slash.set(command.name, command);
                slash.push(command);
                console.log(chalkMy.log, chalkMy.ok, `SlashCommand is being loaded: "${file}"`);
            } else {
                console.log(chalkMy.log, chalkMy.err, `SlashCommand missing a help.name or help.name is not in string: "${file}"`);
                continue;
            }
        }
    }

    client.on("ready", async() => {
        // Register Slash Commands for a single guild
        // await client.guilds.cache
        //    .get("YOUR_GUILD_ID")
        //    .commands.set(slash);

        const register_or_purge = 0;
        if (register_or_purge) {
            console.log(chalkMy.log, chalkMy.ok, `Register Slash Commands for all the guilds.`);
            await client.application.commands.set(slash);
        } else {
            console.log(chalkMy.log, chalkMy.ok, `Purging all slash commands from old version of bot.`);
            // This takes ~1 hour to update
            await client.application.commands.set([]);
            // This updates immediately
            client.guilds.cache.get(process.env.LOG_SERVER_ID).commands.set([]);
        }
    })
}

module.exports = {
    loadEvents,
    //loadCommands,
    loadSlashCommands
}
