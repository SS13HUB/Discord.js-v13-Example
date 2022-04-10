
const chalkMy = require("./../../src/chalk");

module.exports = {
    name: 'ready',
    once: true,

    /**
     * @param {Client} client 
     */
    async execute(client) {
        
        // Puts an activity
        client.user.setActivity("Expectatives#1157", {
            type: "WATCHING",
            name: "Expectatives#1157"
        });
        
        // Send a message on the console
        console.log(chalkMy.load, `We are now online! Logged in as "${client.user.tag}"`);
        console.log(chalkMy.log, `Ready to serve in servers: ${client.guilds.cache.size}; serving online users: ${client.users.cache.size}.`);
    }
}
