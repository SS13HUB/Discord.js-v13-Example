
const { MessageButton, Permissions, Formatters } = require('discord.js');
const chalkMy = require(process.cwd() + "/src/chalk");

self = module.exports = {
    name: "submit-simple",
    usage: '/submit-simple <invite link> <message url (optional)>',
    options: [
        {
            name: 'invite',
            description: 'Invite link you want to me to publish (URL or just code)',
            type: 'STRING',
            required: true
        },
        {
            name: 'message',
            description: 'URL of source message to convert in future.',
            type: 'STRING',
            required: false
        }
    ],
    category: "Utility",
    description: "Like submit, but simple.",
    ownerOnly: true,
    triggers: [
        'submit-simple-check',
    ],
    trigger: async (client, interaction) => {
        console.log(chalkMy.event, `Command triggered: "submit-simple".`);
        const _channel = client.channels.cache.get(process.env.MASTER_CHX_POSTING);
        if (interaction.customId == self.triggers[0]) {
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
        if (!(interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) || !(interaction.member.roles.resolveId(process.env.MASTER_LIBRARIANS_ROLE))) {
            return await interaction.reply({ ephemeral: true, content: `**Access denied**: Only librarian or admin allowed to do this.`});
        }
        
        //if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply({ content: `You can only add servers with ADMINISTRATOR authorization.` });
        const inviteIn = interaction.options.getString("invite");
        if (!inviteIn) return interaction.reply({ ephemeral: true, content: `There is no any invite link!` });
        const messageLinkIn = interaction.options.getString("message");
        
        const inviteFetched = await client.fetchInvite(inviteIn)
            .then((data) => {
                return data;
            })
            .catch(async (e) => {
                console.log('Invite checked, it\'s not alive.\n', e);
                await interaction.reply({ ephemeral: true, content: `Error occured.\nMessage: \`${e.message}\`\nFull:\n\`\`\`${e}\`\`\`` });
                /* if (e.message == "Unknown Invite" || fetchedInvite.message.code == 10006 || e.message.httpStatus == '404') {
                    //return {"code": inviteIn, "message": e};
                } */
                return null;
        });
        if (inviteFetched === null) {
            return;
        }
        if (Boolean(inviteFetched.maxAge)) {
            return await interaction.reply({ ephemeral: true, content: `Error occured.\nLink is not infinity age. I can not accept this.` });
        }
        if (Boolean(inviteFetched.maxUses)) {
            return await interaction.reply({ ephemeral: true, content: `Error occured.\nLink is not infinity uses. I can not accept this.` });
        }
        if (inviteFetched.temporary) {
            return await interaction.reply({ ephemeral: true, content: `Error occured.\nLink is temporary. I can not accept this.` });
        }
        //client.channels.cache.get(process.env.MASTER_CHX_POSTING).send({ content: `inviteDelete event fired`});
        client.channels.cache.get(process.env.MASTER_CHX_POSTING).send({
            content:
                Formatters.bold('Server name') + `: ${inviteFetched.guild.name}\n` +
                Formatters.bold('Server ID') + `: ${inviteFetched.guild.id}\n` +
                ((messageLinkIn) ? (Formatters.bold('Source message: ') + `: ${messageLinkIn}\n`) : ('')) +
                Formatters.bold('Invite') + `: ${((inviteFetched.url) || ((inviteFetched.code) ? (`http://discord.gg/` + inviteFetched.code) : (`http://discord.gg/` + inviteFetched)))}`
        });
        return await interaction.reply({ ephemeral: true, content: `Ok.` });
    },
};
