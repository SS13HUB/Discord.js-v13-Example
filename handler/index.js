
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
                // https://discord.com/developers/docs/interactions/application-commands
                if (command.name < 1 || command.name > 32) {
                    console.log(chalkMy.err, `Warning: Command name not in range 1-32, skipping:`);
                    console.log(command);
                    continue;
                }
                if (command.description < 1 || command.description > 100) {
                    console.log(chalkMy.err, `Warning: Command description not in range 1-100, skipping:`);
                    console.log(command);
                    continue;
                }
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

        const register = 1; // or purge, boolean in integer
        if (Boolean(register)) {
            console.log(chalkMy.load, `Registering Slash Commands for all guilds.`);
            await client.application.commands.set(slash);
            /* await client.application.commands.fetch()
                .then(() => console.log(chalkMy.log, chalkMy.ok, `Registered Slash Commands for all guilds:\n`, slash.keys())); */
                //((command) => console.log(command.values()));
        } else {
            console.log(chalkMy.log, chalkMy.ok, `Purging all slash commands from old version of bot.`);
            // This takes ~1 hour to update
            await client.application.commands.fetch().then((command) => {
                console.log(command);
                command.delete();
            });
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
