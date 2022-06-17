
const fs = require("fs");

/**
 * Load Process Events
 */
module.exports = {
    name: 'LoadProcessEvents',
    enabled: true,

    /**
     * @param {Client} client 
     * @param {ErrorException} error
     */
    async load(client, error) {
        console.log(client.g.chalk.log, `Preparing process events…`);
        const _base_path = client.g.cwd + '\\src\\events\\OS\\process\\';
        const processEventsFiles = fs
            .readdirSync(_base_path)
            .filter((file) => file.endsWith('.js'));
        
        for (const file of processEventsFiles) {
            const processEvent = require(_base_path + file);
            
            if (processEvent.name) {
                console.log(client.g.chalk.load, client.g.chalk.ok, `Process event: "${file}"`); // Event is being loaded:
            } else {
                console.error(client.g.chalk.load, client.g.chalk.err, `Process event missing a help.name or help.name is not in string: "${file}"`);
                continue;
            }

            if (!processEvent.enabled) {
                console.log(client.g.chalk.load, client.g.chalk.ok, `Process event disabled: "${file}"`); // Event is being loaded:
            }
            
            process.on(processEvent.name, (...args) => {
                //console.log(client.g.chalk.processEvent, `Process event fired (once): "${processEvent.name}"`); // (${interaction !== null ? interaction : "null"})
                processEvent.execute(...args, error);
            });
        }
        
        console.log(client.g.chalk.log, client.g.chalk.ok, `Preparing process events done.`);
    }
}
