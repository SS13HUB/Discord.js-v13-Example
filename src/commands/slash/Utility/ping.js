// Example of how to make a SlashCommand

module.exports = {
    name: "ping",
    category: "Utility",
    description: "Check the bot's ping!",
    adminOnly: false,
    ownerOnly: false,
    run: async (client, interaction) => {
        if (interaction.channel) {
            await interaction.channel.sendTyping();
        } else {
            let _channel = await client.channels.fetch(interaction.channelId);
            await _channel.sendTyping();
        }
        const msg = await interaction.channel.send(`🏓 Pinging...`);

        const pingEmbed = new client.g.discord.MessageEmbed()
            .setTitle(':signal_strength: Bot Ping')
            .addField("Time", `${Math.floor(msg.createdAt - interaction.createdAt)}ms`, true)
            .addField("API Ping", `${client.ws.ping}ms`, true)
            .setColor(client.g.config.embedColor)
            .setFooter({ text: `${client.g.config.embedfooterText}`, iconURL: `${client.user.displayAvatarURL()}` });

        await interaction.reply({ embeds: [pingEmbed] });

        msg.delete();
    },
};
