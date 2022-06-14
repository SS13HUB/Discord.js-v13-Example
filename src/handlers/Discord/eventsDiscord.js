
const fs = require("fs");

/**
 * Load Discord Events
 */
module.exports = {
    name: 'LoadDiscordEvents',
    enabled: true,

    /**
     * @param {Client} client 
     */
    async load(client) {
        console.log(client.chalk.log, `Preparing Discord events…`);
        const _base_path = client.cwd + '\\src\\events\\Discord\\';
        const eventFolders = fs.readdirSync(_base_path);
        for (const folder of eventFolders) {
            const eventFiles = fs
                .readdirSync(_base_path + folder)
                .filter((file) => file.endsWith(".js"));
            
            for (const file of eventFiles) {
                
                const event = require(_base_path + folder + '\\' + file);
                
                if (event.name) {
                    console.log(client.chalk.load, client.chalk.ok, `Event: "${file}"`); // Event is being loaded:
                } else {
                    console.log(client.chalk.load, client.chalk.err, `Event missing a help.name or help.name is not in string: "${file}"`);
                    continue;
                }
                
                if (event.once) {
                    client.once(event.name, (...args) => {
                        //console.log(client.chalk.event, `Event fired (once): "${event.name}"`); // (${interaction !== null ? interaction : "null"})
                        event.execute(...args, client);
                    });
                } else {
                    client.on(event.name, (...args) => {
                        //console.log(client.chalk.event, `Event fired: "${event.name}"`, ...args.interaction);
                        event.execute(...args, client);
                    });
                }
            }
        }
        console.log(client.chalk.log, client.chalk.ok, `Preparing Discord events done.`);
    }
}
