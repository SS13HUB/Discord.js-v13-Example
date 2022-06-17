
/*
    Warning: This event only triggers if the client has MANAGE_GUILD permissions for the guild, or MANAGE_CHANNELS permissions for the channel.
    https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-inviteCreate
*/

module.exports = {
    name: 'inviteDelete',

    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        console.log(client.g.chalk.event, `Event fired: "inviteDelete" (${interaction})`);
        return client.channels.cache.get(process.env.MASTER_CHX_DEBUG_LOG).send({ content: `inviteDelete event fired`});
    }
}
