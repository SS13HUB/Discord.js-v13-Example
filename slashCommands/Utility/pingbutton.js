
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: "pingbutton",
    category: "Utility",
    description: "Ping-pong, but with button!",
    ownerOnly: false,
    run: async (client, interaction) => {
        if (interaction.channel) {
            await interaction.channel.sendTyping();
        } else {
            let _channel = await client.channels.fetch(interaction.channelId);
            await _channel.sendTyping();
        }
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('pingbutton_primary')
                    .setLabel('Click on me!')
                    .setStyle('PRIMARY'),
            );

        await interaction.reply({ content: 'Pong!', components: [row] });
    },
};
