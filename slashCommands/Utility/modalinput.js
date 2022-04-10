
const { Modal, TextInputComponent, showModal } = require('discord-modals'); // Now we extract the showModal method

module.exports = {
    name: "modalinput",
    category: "Utility",
    description: "Text input test!",
    ownerOnly: false,
    run: async (client, interaction) => {
        const modal = new Modal() // We create a Modal
            .setCustomId('modal-customid')
            .setTitle('Test of Discord-Modals!')
            .addComponents(
                new TextInputComponent() // We create a Text Input Component
                    .setCustomId('textinput-customid')
                    .setLabel('Some text Here')
                    .setStyle('SHORT') //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
                    .setMinLength(4)
                    .setMaxLength(10)
                    .setPlaceholder('Write a text here')
                    .setRequired(true) // If it's required or not
            );
        //await interaction.reply({ content: 'Pong!', components: [row] });
        await showModal(modal, {
            client: client, // Client to show the Modal through the Discord API.
            interaction: interaction // Show the modal with interaction data.
        })
    },
};
