
const { SlashCommandBuilder } = require('@discordjs/builders'); // require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: "one-time-button",
    category: "Utility",
    description: "A button that will only work once and be destroyed.",
    ownerOnly: true,
    trigger: async (client, interaction) => {
        await interaction.update({ content: 'Pinged', components: [], embeds: [] });
    },
    run: async (client, interaction) => {
        await interaction.channel.sendTyping();
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('one-time-button')
                    .setLabel('Click on me!')
                    .setStyle('PRIMARY'),
            );

        await interaction.reply({ content: 'Pong!', components: [row] });
    },
};
