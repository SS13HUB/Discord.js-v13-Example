
const { Formatters } = require('discord.js');
/* client = {
    g: {
        chalk: require(require('process').cwd() + '\\src\\custom\\chalk')
    }
} */
const chalk = require(require('process').cwd() + '\\src\\custom\\chalk')

module.exports = {
    name: 'rateLimit',

    /**
     * @param {Client} client
     * @param {Info} info
     */
    async execute(client, info) {
        // ToDo: https://discord.com/developers/docs/topics/gateway#privileged-intents
        console.log(chalk.err, `Event fired: "rateLimit".`); // client.g.chalk
        console.log(`Rate limit hit`, (info.timeDifference ? info.timeDifference : (info.timeout ? info.timeout : info))); //'Unknown timeout'
    }
}
