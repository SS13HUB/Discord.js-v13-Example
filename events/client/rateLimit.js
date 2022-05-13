
const { Formatters } = require('discord.js');
const chalkMy = require("../../src/chalk");

module.exports = {
    name: 'rateLimit',

    /**
     * @param {Info} info
     */
    async execute(info) {
        // ToDo: https://discord.com/developers/docs/topics/gateway#privileged-intents
        console.log(chalkMy.err, `Event fired: "rateLimit".`);
        console.log(`Rate limit hit ${info.timeDifference ? info.timeDifference : info.timeout ? info.timeout: 'Unknown timeout '}`)
    }
}
