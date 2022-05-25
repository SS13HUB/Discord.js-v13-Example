
const { Modal, TextInputComponent, showModal } = require('discord-modals'); // Now we extract the showModal method
const { Permissions } = require('discord.js');
const chalkMy = require(process.cwd() + "/src/chalk");

self = module.exports = {
    name: "submit",
    category: "Utility",
    description: "Call form to input invite with server info to propose to publish.",
    ownerOnly: false,
    triggers: [
        'submit-modal-form-post' // submit-modal-form-echo
    ],
    trigger: async (client, interaction) => {
        console.log(chalkMy.event, `Command triggered: "submit".`);
        const _channel = client.channels.cache.get(process.env.MASTER_POSTING);
        if (interaction.customId == self.triggers[0]) {
            if (!(interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) || !(interaction.member.roles.resolveId(process.env.LIBRARIANS))) {
                return await interaction.reply({ ephemeral: true, content: `**Access denied**: Only librarian or admin allowed to do this.`});
            }
            await interaction.update({ components: [] }); // Message.removeAttachments
            if (interaction.message.content) {
                return await _channel.send({
                    content: interaction.message.content, 
                    embeds: interaction.message.embeds, 
                    components: interaction.message.components
                });
            } else {
                return await _channel.send({
                    embeds: interaction.message.embeds, 
                    components: interaction.message.components
                });
            }
        }
    },
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
                    .setMaxLength(30)
                    .setPlaceholder('http://discord.gg/123')
                    .setRequired(true),
                new TextInputComponent()
                    .setCustomId('textinput-alive')
                    .setLabel('Is this server active or not?')
                    .setStyle('SHORT')
                    .setMinLength(1)
                    .setMaxLength(1)
                    .setPlaceholder('"+" or "-" without quotes')
                    .setRequired(false),
                new TextInputComponent()
                    .setCustomId('textinput-language')
                    .setLabel('List project languages')
                    .setStyle('SHORT')
                    .setMinLength(2)
                    .setMaxLength(20)
                    .setPlaceholder('English, Russian')
                    .setRequired(false)
            );
        await showModal(modal, {
            client: client, // Client to show the Modal through the Discord API.
            interaction: interaction // Show the modal with interaction data.
        })
    },
};
