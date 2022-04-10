/**
 * Example Event
 */

module.exports = {
    name: 'guildMemberAdd',

    /**
     * @param {GuildMember} member 
     * @param {Client} client 
     */
    async execute(member, client) {
        const { guild } = member;
        console.log(`${member.id} join guilds ${guild.id} (${member.user.username}, ${guild.name})`);
    }
}
