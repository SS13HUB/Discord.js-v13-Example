
const { SlashCommandBuilder } = require('@discordjs/builders'); // require('discord.js');

module.exports = {
    name: "save",
    category: "Utility",
    description: "Save something.",
    adminOnly: false,
    ownerOnly: true,
    doNotRegisterSlash: false,
    triggers: [],
    trigger: async () => {return;},
    options: [
        {
            name: "mode",
            description: "choose a new loop mode to change!",
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
