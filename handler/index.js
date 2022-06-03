
const fs = require("fs");
const chalkMy = require(process.cwd() + "/src/chalk");

/**
 * Load Events
 */
const loadEvents = async function (client) {
    console.log(chalkMy.log, `Preparing events…`);
    const eventFolders = fs.readdirSync(process.cwd() + "/events");
    for (const folder of eventFolders) {
        const eventFiles = fs
        .readdirSync(`${process.cwd()}/events/${folder}`)
        .filter((file) => file.endsWith(".js"));
        
        for (const file of eventFiles) {
            const event = require(`${process.cwd()}/events/${folder}/${file}`);
            
            if (event.name) {
                console.log(chalkMy.load, chalkMy.ok, `Event: "${file}"`); // Event is being loaded:
            } else {
                console.log(chalkMy.load, chalkMy.err, `Event missing a help.name or help.name is not in string: "${file}"`);
                continue;
            }
            
            if (event.once) {
                client.once(event.name, (...args) => {
                    //console.log(chalkMy.event, `Event fired (once): "${event.name}"`); // (${interaction !== null ? interaction : "null"})
                    event.execute(...args, client);
                });
            } else {
                client.on(event.name, (...args) => {
                    //console.log(chalkMy.event, `Event fired: "${event.name}"`, ...args.interaction);
                    event.execute(...args, client);
                });
            }
        }
    }
    console.log(chalkMy.log, chalkMy.ok, `Preparing events done.`);
}

/**
 * Load Prefix Commands
 */
/* const loadCommands = async function (client) {
    console.log(chalkMy.log, `Preparing commands…`);
    const commandFolders = fs.readdirSync(process.cwd() + "/commands");
    for (const folder of commandFolders) {
        const commandFiles = fs
            .readdirSync(`${process.cwd()}/commands/${folder}`)
            .filter((file) => file.endsWith(".js"));
        
        for (const file of commandFiles) {
            const command = require(`${process.cwd()}/commands/${folder}/${file}`);
            
            if (command.name) {
                client.commands.set(command.name, command);
                console.log(chalkMy.load, chalkMy.ok, `Prefix Command: "${file}"`); // Prefix Command is being loaded:
            } else {
                console.log(chalkMy.load, chalkMy.err, `Prefix Command missing a help.name or help.name is not in string: "${file}"`);
                continue;
            }
            
            if (command.aliases && Array.isArray(command))
                command.aliases.forEach((alias) => client.aliases.set(alias, command.name));
        }
    }
    console.log(chalkMy.log, chalkMy.ok, `Preparing commands done.`);
} */

/**
 * Load SlashCommands
 */
const loadSlashCommands = async function (client) {
    console.log(chalkMy.log, `Preparing slashes…`);
    let slash = [];

    const commandFolders = fs.readdirSync(process.cwd() + "/slashCommands");
    for (const folder of commandFolders) {
        const commandFiles = fs
            .readdirSync(`${process.cwd()}/slashCommands/${folder}`)
            .filter((file) => file.endsWith(".js"));
        
        for (const file of commandFiles) {
            const command = require(`${process.cwd()}/slashCommands/${folder}/${file}`);
            
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
                console.log(chalkMy.load, chalkMy.ok, `SlashCommand: "${file}"${((command.triggers) ? ('; "' + JSON.stringify(command.triggers) + '"') : (''))}`); // SlashCommand is being loaded:
            } else {
                console.log(chalkMy.load, chalkMy.err, `SlashCommand missing a help.name or help.name is not in string: "${file}"`);
                continue;
            }
        }
    }
    // console.log(chalkMy.log, `Waiting for client readiness…`);

    client.on("ready", async() => {
        // Register Slash Commands for a single guild
        // await client.guilds.cache
        //    .get("YOUR_GUILD_ID")
        //    .commands.set(slash);

        const register = 1; // or purge, bool in int
        if (Boolean(register)) {
            console.log(chalkMy.load, `Registering ${slash.length} Slash Commands for all guilds.`);
            //console.log(slash);
            /* for (let i = 0; i < slash.length; i++) {
                let cmd  = slash[i];
                let ii   = i < 10 ? ` ${i}`: i;
                let iii  = cmd.name.length < 10 ? ` ${cmd.name.length}`: cmd.name.length;
                let iiii = cmd.description.length < 100 ? cmd.description.length < 10 ? `  ${cmd.description.length}`: ` ${cmd.description.length}`: cmd.description.length;
                console.log(`[${ii}/${slash.length - 1}] (${iii}/32;${iiii}/100) "${cmd.name}", "${cmd.description}"`);
            } */
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
            client.guilds.cache.get(process.env.MASTER_SERVER).commands.set([]);
        }
    })
    console.log(chalkMy.log, chalkMy.ok, `Preparing slashes done.`);
}

module.exports = {
    loadEvents,
    //loadCommands,
    loadSlashCommands
}
