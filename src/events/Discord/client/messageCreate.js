module.exports = {
    name: 'messageCreate',

    /**
     * @param {Message} message 
     * @param {Client} client 
     */
    async execute(message, client) {
        if (message.author.bot || !message.guild || !message.content.toLowerCase().startsWith(client.g.config.botPrefix)) return;
        const [cmd, ...args] = message.content.slice(client.g.config.botPrefix.length).trim().split(" ");
        const command = client.g.cmds.legacy.get(cmd.toLowerCase()) || client.g.cmds.legacy.find(c => c.aliases?.includes(cmd.toLowerCase()));
        
        if (!command) return;
        
        if (command.adminOnly) {
            if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
                await client.users.cache.get(process.env.OWNER_ID).send(`**Warning**: User ${interaction.user.id} tries send me in ${interaction.guildId ? interaction.guildId : 'DM'} command without rights:\n\`${command}\`.`);
                return await message.reply({ allowedMentions: { repliedUser: false }, content: `This command only for users with ADMINISTRATOR authorization.` });
            }
        }
        if (command.ownerOnly) {
            if (message.author.id !== process.env.OWNER_ID) {
                return message.reply({ content: "This command only for Bot Owner!", allowedMentions: { repliedUser: false } });
            }
        }
        
        try {
            if (interaction.channel) {
                await interaction.channel.sendTyping();
            } else {
                let _channel = await client.channels.fetch(interaction.channelId);
                await _channel.sendTyping();
            }
        } catch (e) {
            console.log('Can\'t send typing:', e);
        }
        await command.run(client, message, args);
    }
}
