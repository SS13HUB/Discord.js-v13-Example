
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
            if ((fetchedInvite === null) ||
                (fetchedInvite.message.httpStatus != 200)) {
                if ((fetchedInvite.message.httpStatus == 404) || (fetchedInvite.message.code == 10006) || (fetchedInvite.message == "DiscordAPIError: Unknown Invite")) {
                    //console.log(interaction.guild.channels);
                    const savedServerID = interaction.message.embeds[0].footer.text.split('Server: ')[1];
                    //console.log("savedServerID:", savedServerID);
                    /* if (!interaction.message[0]) {
                        return interaction.reply(`**Error**:\n\`\`\``, e, `\`\`\``);
                    } */
                    /* if (interaction.message[1].embeds == []) {
                        return interaction.reply(`**Error**:\nNo embeds.`);
                    } */
                    //await interaction.reply({ ephemeral: true, content: `**Error**: Invite is dead[.](<https://youtu.be/QO8yvDd3X-Q>)` });
                    let isServer = await client.guilds.fetch(savedServerID)
                        .then((d) => {return d})
                        .catch(() => {return false});
                    if (!isServer) {
                        return await interaction.followUp({ ephemeral: true, content: `**Error**: Server is dead[.](<https://youtu.be/QO8yvDd3X-Q>)` });
                    }
                    //await interaction.followUp({ ephemeral: true, content: `**Success**: But server is alive.` });
                    // .filter(chx => chx.type === "GUILD_TEXT").find(x => x.position === 0)
                    const _arr = ["GUILD_TEXT", "GUILD_NEWS", "UNKNOWN"];
                    let firstChannel = [...isServer.channels.cache.filter(chx => _arr.includes(chx.type)).keys()][0];
                    // isServer.channels.cache.filter(chx => _arr.includes(chx.type)).keys()
                    //.first() //.firstKey()
                    //console.log("firstChannel:", firstChannel);
                    //await interaction.followUp({ ephemeral: true, content: `**Target channel**: \`${firstChannel}\`.` });
                    let targetChannel = await client.channels.cache.get(firstChannel);
                    //console.log("targetChannel:", targetChannel);
                    //let createdInvite = targetChannel.createInvite({ maxAge: 0 });
                    let createdInvite = 'testHJGFUDBG';
                    console.log("interaction.message.content:", interaction.message.content);
                    console.log("interaction.message.embeds[0]:", interaction.message.embeds[0]);
                    console.log("interaction.message.components[0].components:", interaction.message.components[0].components);
                    let _savedMessage = interaction.message;
                    _savedMessage.content = createdInvite;
                    _savedMessage.embeds[0].fields[0] = { value: createdInvite, name: 'Invite', inline: true };
                    _savedMessage.embeds[0].fields[4] = { value: 'No', name: 'Is Already Memorized:', inline: false };
                    //console.log("_savedMessage:", _savedMessage);
                    await interaction.update({
                        content: _savedMessage.content, 
                        embeds: _savedMessage.embeds, 
                        components: _savedMessage.components
                    }); // Message.removeAttachments
                    await interaction.followUp({ ephemeral: true, content: `**Success**: Invite refreshed.` });
                    return;
                }
                return await interaction.followUp({ ephemeral: true, content: `**Error**: ${JSON.stringify(fetchedInvite)}; message: ${fetchedInvite.message}`});
            } else {
                // if (fetchedInvite.message !== undefined) {}
                console.log("fetchedInvite:", fetchedInvite);
                return await interaction.reply({ ephemeral: true, content: `**Success**: Invite is alive.`});
            }
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
