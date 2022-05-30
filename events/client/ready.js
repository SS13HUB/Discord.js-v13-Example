
const chalkMy = require(process.cwd() + "/src/chalk");

module.exports = {
    name: 'ready',
    once: true,

    /**
     * @param {Client} client 
     */
    async execute(client) {
        
        // Puts an activity
        /* client.user.setActivity("Expectatives#1157", {
            type: "WATCHING",
            name: "Expectatives#1157"
        }); */
        // client.user.setStatus("online");
        client.user.setPresence({
            activities: [{ 
                name: "/help", // Use slash command.
                type: "WATCHING"
            }],
            status: "online"
        });
        
        // Send a message on the console
        console.log(chalkMy.log, chalkMy.ok, `We are now online! Logged in as "${client.user.tag}"`);
        console.log(chalkMy.log, `Servers: ${client.guilds.cache.size}, online users: ${client.users.cache.size}`);
        console.log(chalkMy.log, `${client.discord.Constants.UserAgent}`); // UserAgent: 
    }
}
