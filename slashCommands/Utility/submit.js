
const { Modal, TextInputComponent, showModal } = require('discord-modals'); // Now we extract the showModal method

module.exports = {
    name: "submit",
    category: "Utility",
    description: "Call form to input invite with server info to propose to publish.",
    ownerOnly: false,
    run: async (client, interaction) => {
        await interaction.channel.sendTyping();
        const modal = new Modal() // We create a Modal
            .setCustomId('submit-modal-form')
            .setTitle('Submit your invite')
            .addComponents(
                new TextInputComponent()
                    .setCustomId('textinput-invite')
                    .setLabel('Your invite (as link or just code)')
                    .setStyle('SHORT')
                    .setMinLength(1)
                    .setMaxLength(15)
                    .setPlaceholder('http://discord.gg/123')
                    .setRequired(true),
                new TextInputComponent()
                    .setCustomId('textinput-alive')
                    .setLabel('Is this server active or not?')
                    .setStyle('SHORT')
                    .setMinLength(1)
                    .setMaxLength(1)
                    .setPlaceholder('"+" or "-" without quotes')
                    .setRequired(true),
                new TextInputComponent()
                    .setCustomId('textinput-language')
                    .setLabel('List project languages')
                    .setStyle('SHORT')
                    .setMinLength(2)
                    .setMaxLength(20)
                    .setPlaceholder('English, Russian')
                    .setRequired(true)
            );
        await showModal(modal, {
            client: client, // Client to show the Modal through the Discord API.
            interaction: interaction // Show the modal with interaction data.
        })
    },
};
