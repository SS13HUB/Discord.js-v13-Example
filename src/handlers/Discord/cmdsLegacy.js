
const fs = require("fs");

/*
    WARNING: DEPRECATING, DO NOT USE
    https://support-dev.discord.com/hc/en-us/articles/4404772028055
*/

/**
 * Load Legacy Prefix Commands
 */
module.exports = {
    name: 'loadLegacyCommands',
    enabled: true,

    /**
     * @param {Client} client 
     */
    async load(client) {
        console.log(client.chalk.log, `Preparing legacy commands…`);
        const _base_path = client.cwd + '\\src\\commands\\legacy\\';
        const commandFolders = fs.readdirSync(_base_path);
        for (const folder of commandFolders) {
            const commandFiles = fs
                .readdirSync(_base_path + folder)
                .filter((file) => file.endsWith(".js"));
            
            for (const file of commandFiles) {
                const command = require(_base_path + folder + '\\' + file);
                
                if (command.name) {
                    client.commands.set(command.name, command);
                    console.log(client.chalk.load, client.chalk.ok, `Prefix Command: "${file}"`); // Prefix Command is being loaded:
                } else {
                    console.log(client.chalk.load, client.chalk.err, `Prefix Command missing a help.name or help.name is not in string: "${file}"`);
                    continue;
                }
                
                if (command.aliases && Array.isArray(command))
                    command.aliases.forEach((alias) => client.aliases.set(alias, command.name));
            }
        }
        console.log(client.chalk.log, client.chalk.ok, `Preparing legacy commands done.`);
    }
}
