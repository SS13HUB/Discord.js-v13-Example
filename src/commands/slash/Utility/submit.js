
const { Modal, TextInputComponent, showModal } = require('discord-modals'); // Now we extract the showModal method
const { MessageButton, Permissions } = require('discord.js');


const self = module.exports = {
    name: "submit",
    category: "Utility",
    description: "Call form to input invite with server info to propose to publish.",
    adminOnly: false,
    ownerOnly: false,
    doNotRegisterSlash: false,
    triggers: [
        'submit-modal-form-post', // submit-modal-form-echo
        'submit-modal-form-check',
    ],
    trigger: async (client, interaction) => {
        console.log(client.g.chalk.event, `Command triggered: "submit".`);
        console.log('self.triggers:', self.triggers);
        console.log('interaction:', interaction);
        const _channel = client.channels.cache.get(process.env.MASTER_CHX_POSTING);
        if (interaction.customId == self.triggers[0]) {
            if (!(interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) && !(interaction.member.roles.resolveId(process.env.MASTER_LIBRARIANS_ROLE))) {
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
            console.log('inviteCode:', inviteCode);
            const fetchedInvite = await client.fetchInvite(inviteCode)
                .then((val) => {return [true, val];})
                .catch((err) => {return [false, err];});
            //console.log('fetchedInvite:', fetchedInvite[1]);
            if (fetchedInvite[0] == false) {
                if ((fetchedInvite[1].httpStatus == 404) || (fetchedInvite[1].code == 10006) || (fetchedInvite[1].message == "DiscordAPIError: Unknown Invite")) {
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
                        return await interaction.reply({ ephemeral: true, content: `**Error**: Server is dead[.](<https://youtu.be/QO8yvDd3X-Q>)` });
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
                    let createdInvite = await targetChannel.createInvite();
                    //console.log('createdInvite:', createdInvite);
                    /* createdInvite = await client.fetchInvite('PRCrgFPMNw')
                        .then((val) => {return [true, val];})
                        .catch((err) => {return [false, err];});
                    if (createdInvite[0] == false) {
                        console.error('createdInvite:', createdInvite[1]);
                        return await interaction.reply({ content: `Error: ${createdInvite[1]}; message:${createdInvite[1].message}` });
                    } */
                    // createdInvite = createdInvite[1];
                    //let createdInvite = 'testHJGFUDBG';
                    //console.log("createdInvite:", createdInvite);
                    //console.log("interaction.message.content:", interaction.message.content);
                    //console.log("interaction.message.embeds[0]:", interaction.message.embeds[0]);
                    //console.log("interaction.message.components[0].components:", interaction.message.components[0].components);
                    let array = interaction.message.components[0].components;
                    for (let i = 0; i < array.length; i++) {
                        const element = array[i];
                        if (element.url) {
                            if (element.url.includes('//discord.gg/')) { // https://discord.
                                interaction.message.components[0].components[i] = new MessageButton()
                                    .setLabel('Join')
                                    .setURL(createdInvite.url)
                                    .setStyle('LINK');
                                break;
                            }
                        }
                    }
                    let _savedMessage = interaction.message;
                    _savedMessage.content = createdInvite.url;
                    _savedMessage.embeds[0].fields[0] = { value: `${createdInvite.code}`, name: 'Invite', inline: true };
                    //_savedMessage.embeds[0].fields[4] = { value: 'No', name: 'Is Already Memorized:', inline: false };
                    //console.log("_savedMessage:", _savedMessage);
                    await interaction.update({
                        content: _savedMessage.content, 
                        embeds: _savedMessage.embeds, 
                        components: _savedMessage.components
                    }); // Message.removeAttachments
                    await interaction.followUp({ ephemeral: true, content: `**Success**: Invite refreshed.` });
                    return;
                } else {
                    //return await interaction.reply({ ephemeral: true, content: `**Exception**: Unknown error.`});
                    console.log('fetchedInvite:', fetchedInvite[1]);
                    return await interaction.reply({ ephemeral: true, content: `**Error**: ${JSON.stringify(fetchedInvite[1])}; message: ${fetchedInvite[1].message}`});
                }
            } else {
                // if (fetchedInvite[1].message !== undefined) {}
                //console.log("fetchedInvite:", fetchedInvite[1]);
                return await interaction.reply({ ephemeral: true, content: `**Success**: Invite is alive, refresh is not needed.`});
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
        if ((interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) || (interaction.member.roles.resolveId(process.env.MASTER_LIBRARIANS_ROLE))) {
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
                        .setRequired(false),
                    new TextInputComponent()
                        .setCustomId('textinput-submitter')
                        .setLabel('Submitter')
                        .setStyle('SHORT')
                        .setMinLength(2)
                        .setMaxLength(20)
                        .setPlaceholder('Discord user ID')
                        .setRequired(false),
                    new TextInputComponent()
                        .setCustomId('textinput-timestamp')
                        .setLabel('Submit timestamp')
                        .setStyle('SHORT')
                        .setMinLength(2)
                        .setMaxLength(20)
                        .setPlaceholder('Date, number or null')
                        .setRequired(false)
                    // Open Google Chrome, press F12, select Console, type "Math.floor(new Date().getTime()/1000.0)"
                    // or use "https://epochconverter.com/"
                );
            await showModal(modal, {
                client: client, // Client to show the Modal through the Discord API.
                interaction: interaction // Show the modal with interaction data.
            });
        } else {
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
            });
        }
    },
};
