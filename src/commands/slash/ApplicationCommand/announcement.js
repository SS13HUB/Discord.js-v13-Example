
/* const process = require('process');
const index = require(process.cwd() + '\\index');
const client = index.client; */

// CommandInteraction
const { Client, ContextMenuInteraction, Constants } = require('discord.js'); // client.g.discord;
//console.log('ApplicationCommandTypes.MESSAGE:', Constants.ApplicationCommandTypes.MESSAGE); //3


const self = module.exports = {
    name: "announcement",
    category: "Utility",
    description: "Text input test!",
    type: Constants.ApplicationCommandTypes.MESSAGE,
    adminOnly: false,
    ownerOnly: false,
    doNotRegisterSlash: false,
    options: [],
    triggers: [
        'announcement-send'
    ],
    trigger: async () => {return;},
    /**
     * @param {Client} client
     * @param {ContextMenuInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        console.log('interaction:', interaction);
        return await interaction.reply({ content: `announcement` }); // ephemeral: true, 
    },
};
