
const { Modal, TextInputComponent, showModal } = require('discord-modals'); // Now we extract the showModal method
const { Permissions } = require('discord.js');
const chalkMy = require(process.cwd() + "/src/chalk");

self = module.exports = {
    name: "submit",
    category: "Utility",
    description: "Call form to input invite with server info to propose to publish.",
    ownerOnly: false,
    triggers: [
        'submit-modal-form-post', // submit-modal-form-echo
        'submit-modal-form-check',
    ],
    trigger: async (client, interaction) => {
        console.log(chalkMy.event, `Command triggered: "submit".`);
        const _channel = client.channels.cache.get(process.env.MASTER_POSTING);
        if (interaction.customId == self.triggers[0]) {
            if (!(interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) || !(interaction.member.roles.resolveId(process.env.LIBRARIANS))) {
                return await interaction.reply({ ephemeral: true, content: `**Access denied**: Only librarian or admin allowed to do this.`});
            }
            let _MessageActionRow = interaction.message.components;
            //console.log("_MessageActionRow:", _MessageActionRow);
            if (Object.keys(_MessageActionRow).length > 0) {
                _MessageActionRow[0].spliceComponents(0, 1); // "Post" button
            }
            // submitted form clearing
            await interaction.update({ components: _MessageActionRow }); // Message.removeAttachments
            if (interaction.message.content) {
                return await _channel.send({
                    content: interaction.message.content, 
                    embeds: interaction.message.embeds, 
                    components: _MessageActionRow
                });
            } else {
                return await _channel.send({
                    embeds: interaction.message.embeds, 
                    components: _MessageActionRow
                });
            }
        } else if (interaction.customId == self.triggers[1]) {
            let inviteCode = interaction.message.content;
            const fetchedInvite = await client.fetchInvite(inviteCode)
                .then((data) => {
                    return data;
                })
                .catch((e) => {
                    if (e.message == "Unknown Invite" || fetchedInvite.message.code == 10006 || e.message.httpStatus == '404') {
                        return {"code": inviteCode, "message": e};
                    }
                    return null;
            });
            if (fetchedInvite === null) {
                return await interaction.reply({ ephemeral: true, content: `**Error**: ${e}; message: ${e.message}`});
            }
            // if (fetchedInvite.message !== undefined) {}
            return await interaction.reply({ ephemeral: true, content: `**Success**: Invite is alive.`});
        }
    },
    run: async (client, interaction) => {
        if (interaction.channel) {
            await interaction.channel.sendTyping();
        } else {
            let _channel = await client.channels.fetch(interaction.channelId);
            await _channel.sendTyping();
        }
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
