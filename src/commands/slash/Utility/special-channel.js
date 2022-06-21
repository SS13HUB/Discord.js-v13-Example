
//


module.exports = {
    name: "special-channel",
    category: "Utility",
    description: "Not for public use, sorry.",
    adminOnly: false,
    ownerOnly: true,
    doNotRegisterSlash: false,
    triggers: [],
    trigger: async () => {return;},
    run: async (client, interaction) => {
        if (interaction.channel) {
            await interaction.channel.sendTyping();
        } else {
            let _channel = await client.channels.fetch(interaction.channelId);
            await _channel.sendTyping();
        }
        const pingEmbed = new client.g.discord.MessageEmbed()
            .setTitle('Special message for channel')
            .setDescription(`This channel definitely created/updated specially for me:\n${client.user.toString()}`)
            .setColor('DARK');
        await interaction.channel.send({ embeds: [pingEmbed] });
        return await interaction.reply({ ephemeral: true, content: `Ok.` });
    },
};
