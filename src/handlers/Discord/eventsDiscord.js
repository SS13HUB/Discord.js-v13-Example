
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
        console.log(client.g.chalk.log, `Preparing Discord events…`);
        const _base_path = client.g.cwd + '\\src\\events\\Discord\\';
        const eventFolders = fs.readdirSync(_base_path);
        for (const folder of eventFolders) {
            const eventFiles = fs
                .readdirSync(_base_path + folder)
                .filter((file) => file.endsWith(".js"));
            
            for (const file of eventFiles) {
                
                const event = require(_base_path + folder + '\\' + file);
                
                if (event.name) {
                    console.log(client.g.chalk.load, client.g.chalk.ok, `Event: "${file}"`); // Event is being loaded:
                } else {
                    console.log(client.g.chalk.load, client.g.chalk.err, `Event missing a help.name or help.name is not in string: "${file}"`);
                    continue;
                }
                
                if (event.once) {
                    client.once(event.name, (...args) => {
                        //console.log(client.g.chalk.event, `Event fired (once): "${event.name}"`); // (${interaction !== null ? interaction : "null"})
                        event.execute(...args, client);
                    });
                } else {
                    client.on(event.name, (...args) => {
                        //console.log(client.g.chalk.event, `Event fired: "${event.name}"`, ...args.interaction);
                        event.execute(...args, client);
                    });
                }
            }
        }
        console.log(client.g.chalk.log, client.g.chalk.ok, `Preparing Discord events done.`);
    }
}
