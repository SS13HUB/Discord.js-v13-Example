
const { SlashCommandBuilder } = require('@discordjs/builders'); // require('discord.js');

module.exports = {
    name: "save",
    category: "Utility",
    description: "Save something.",
    adminOnly: false,
    ownerOnly: true,
    options: [
        {
            name: "mode",
            description: "choose a new loop mode to chnage!",
            type: 'STRING',
            required: false,
            choices: [
                {
                    name: "Off",
                    value: "off"
                },
                {
                    name: "Track",
                    value: "track"
                }
            ]
        }
    ],
    run: async (client, interaction) => {
        await interaction.reply("In development.");
    },
};
