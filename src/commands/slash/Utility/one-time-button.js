
const { SlashCommandBuilder } = require('@discordjs/builders'); // require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');


const self = module.exports = {
    name: "one-time-button",
    category: "Utility",
    description: "A button that will only work once and be destroyed.",
    adminOnly: false,
    ownerOnly: false,
    doNotRegisterSlash: false,
    triggers: [
        'one-time-button'
    ],
    trigger: async (client, interaction) => {
        if (interaction.customId == self.triggers[0]) {
            await interaction.update({ content: 'Pinged', components: [], embeds: [] });
        }
    },
    run: async (client, interaction) => {
        if (interaction.channel) {
            await interaction.channel.sendTyping();
        } else {
            let _channel = await client.channels.fetch(interaction.channelId);
            await _channel.sendTyping();
        }
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId(self.triggers[0])
                .setLabel('Click on me!')
                .setStyle('PRIMARY'),
            );

        await interaction.reply({ content: 'Pong!', components: [row] });
    },
};
