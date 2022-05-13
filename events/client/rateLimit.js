
const { Formatters } = require('discord.js');
const chalkMy = require("../../src/chalk");

module.exports = {
    name: 'rateLimit',

    /**
     * @param {Info} info
     */
    async execute(info) {
        console.log(chalkMy.err, `Event fired: "rateLimit".`);
        console.log(`Rate limit hit ${info.timeDifference ? info.timeDifference : info.timeout ? info.timeout: 'Unknown timeout '}`)
    }
}
