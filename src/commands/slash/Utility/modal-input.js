
const { Modal, TextInputComponent, showModal } = require('discord-modals'); // Now we extract the showModal method


module.exports = {
    name: "modal-input",
    category: "Utility",
    description: "Text input test!",
    adminOnly: false,
    ownerOnly: false,
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
        const modal = new Modal() // We create a Modal
            .setCustomId('modal-customid')
            .setTitle('Test of Discord-Modals!')
            .addComponents(
                new TextInputComponent() // We create a Text Input Component
                    .setCustomId('textinput-customid')
                    .setLabel('Some text Here')
                    .setStyle('SHORT') //IMPORTANT: 'SHORT' or 'LONG'
                    .setMinLength(4)
                    .setMaxLength(10)
                    .setPlaceholder('Write a text here')
                    .setRequired(true), // If it's required or not
                new TextInputComponent()
                    .setCustomId('textinput-customid-2')
                    .setLabel('Some text Here')
                    .setStyle('LONG')
                    .setMinLength(4)
                    .setMaxLength(10)
                    .setPlaceholder('Write a text here')
                    .setRequired(true)
            );
        //await interaction.reply({ content: 'Pong!', components: [row] });
        await showModal(modal, {
            client: client, // Client to show the Modal through the Discord API.
            interaction: interaction // Show the modal with interaction data.
        })
    },
};
