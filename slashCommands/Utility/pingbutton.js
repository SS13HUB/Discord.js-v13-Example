
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: "pingbutton",
    category: "Utility",
    description: "Ping-pong, but with button!",
    ownerOnly: false,
    run: async (client, interaction) => {
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('primary')
                    .setLabel('Primary')
                    .setStyle('PRIMARY'),
            );

        await interaction.reply({ content: 'Pong!', components: [row] });
    },
};
