
const { MessageActionRow, MessageButton, Permissions, Formatters } = require('discord.js');

/* const self = {
    "triggers": [
        'submit-simple-check',
        'submit-simple-convert',
    ],
} */

const self = module.exports = {
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
    adminOnly: false,
    ownerOnly: true,
    triggers: [
        'submit-simple-check',
        'submit-simple-convert',
    ],
    trigger: async (client, interaction) => {
        if (interaction.channel) {
            await interaction.channel.sendTyping();
        } else {
            let _channel = await client.channels.fetch(interaction.channelId);
            await _channel.sendTyping();
        }
        if (!(interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) && !(interaction.member.roles.resolveId(process.env.MASTER_LIBRARIANS_ROLE))) {
            return await interaction.reply({ ephemeral: true, content: `**Access denied**: Only librarian or admin allowed to do this.`});
        }
        if (interaction.customId == self.triggers[0]) {
            let messageContentParsed = {};
            let _content = interaction.message.content
                .split('\n');
            for (let i = 0; i < _content.length; i++) { // .replaceAll('https', 'http')
                const element = _content[i].replaceAll('**', '').split(': ');
                messageContentParsed[element[0]] = element[1]; //messageContentParsed.push(element);
            }
            //console.log('messageContentParsed:', messageContentParsed);
            //console.log('self.triggers:', self.triggers);
            //console.log('interaction:', interaction);
            //return;
            const inviteFetched = await client.fetchInvite(messageContentParsed.Invite)
                .then((val) => {return [true, val];})
                .catch((err) => {return [false, err];});
            //console.log('inviteFetched:', inviteFetched[1]);
            if (inviteFetched[0] == false) {
                if ((inviteFetched[1].httpStatus == 404) || (inviteFetched[1].code == 10006) || (inviteFetched[1].message == "DiscordAPIError: Unknown Invite")) {
                    //let _status1 = 'Unknown';
                    /* _status1 = 'Cann\t fetch server from Discord API'
                    _status1 = 'Cann\t get server from my cache'
                    _status1 = 'Cann\t fetch server widget from Discord API' */
                    //return console.log('client.fetchGuildWidget(messageContentParsed[\'Server ID\']:', await client.guilds.cache.get(messageContentParsed['Server ID'] + 3));
                    let _server = await client.guilds.cache.get(messageContentParsed['Server ID']);
                    if (_server === undefined) {
                        console.log('Cache failed.');
                        _server = await client.guilds.fetch(messageContentParsed['Server ID']);
                        if (_server === undefined) {
                            console.log('API Failed. R.I.P.');
                            return await client.channels.cache.get(process.env.MASTER_CHX_POSTING_WANTED).send({ content:
                                Formatters.bold('Server name') + `: ${messageContentParsed['Server name']}\n` +
                                Formatters.bold('Server ID') + `: ${messageContentParsed['Server ID']}\n` +
                                Formatters.bold('Status update') + `: Invite got revoked, and Discord server seems dead. R.I.P…\n` +
                                Formatters.bold('Source message') + `: ${interaction.message.url}`
                            });
                        }
                        console.log('Cache failed, API OK.');
                        return await client.channels.cache.get(process.env.MASTER_CHX_POSTING_WANTED).send({ content:
                            Formatters.bold('Server name') + `: ${messageContentParsed['Server name']}\n` +
                            Formatters.bold('Server ID') + `: ${messageContentParsed['Server ID']}\n` +
                            Formatters.bold('Status update') + `: Invite got revoked, but I'm __not on the server__. **Manual refresh required**.\n` +
                            Formatters.bold('Source message') + `: ${interaction.message.url}`
                        });
                    } else {
                        console.log('Cache OK.');
                        if (!_server.me.permissions.has([Permissions.FLAGS.CREATE_INSTANT_INVITE, Permissions.FLAGS.MANAGE_CHANNELS, Permissions.FLAGS.MANAGE_GUILD])) {
                            return await client.channels.cache.get(process.env.MASTER_CHX_POSTING_WANTED).send({ content:
                                Formatters.bold('Server name') + `: ${messageContentParsed['Server name']}\n` +
                                Formatters.bold('Server ID') + `: ${messageContentParsed['Server ID']}\n` +
                                Formatters.bold('Status update') + `: Invite got revoked, and I'm on the server but __without rights__ to create new invites. **Manual refresh required**.\n` +
                                Formatters.bold('Source message') + `: ${interaction.message.url}`
                            });
                        }
                        const _arr = ["GUILD_TEXT", "GUILD_NEWS", "UNKNOWN"];
                        //console.log('filter:', JSON.stringify([..._server.channels.cache.keys()].sort((a, b) => {a - b})));
                        const _channelsPrepared = _server.channels.cache.filter(chx => _arr.includes(chx.type));
                        //console.log('_channelsPrepared:', _channelsPrepared);
                        const _channelsCandidate = [..._channelsPrepared.keys()];
                        //console.log('_channelsCandidate:', _channelsCandidate);
                        const _channelCandidateIndex = [..._channelsPrepared.map(chx => chx.rawPosition)].indexOf(0);
                        if (_channelCandidateIndex == -1) {
                            return await client.channels.cache.get(process.env.MASTER_CHX_POSTING_WANTED).send({ content:
                                Formatters.bold('Server name') + `: ${messageContentParsed['Server name']}\n` +
                                Formatters.bold('Server ID') + `: ${messageContentParsed['Server ID']}\n` +
                                Formatters.bold('Status update') + `: Invite got revoked, and I'm not on the server with rights to create new invites, but there is __no channels__ to invite to. **Manual refresh required**.\n` +
                                Formatters.bold('Source message') + `: ${interaction.message.url}`
                            });
                        }
                        //console.log('_channelCandidateIndex:', _channelCandidateIndex);
                        const _channelCandidate = _channelsPrepared.get(_channelsCandidate[_channelCandidateIndex]);
                        // console.log('_channelCandidate:', _channelCandidate);
                        //return;
                    }
                } else {
                    //return await interaction.reply({ ephemeral: true, content: `**Exception**: Unknown error.`});
                    console.log('inviteFetched:', inviteFetched[1]);
                    return await interaction.reply({ content: `**Error**: ${JSON.stringify(inviteFetched[1])}; message: ${inviteFetched[1].message}`});
                }
            } else {
                // if (inviteFetched[1].message !== undefined) {}
                //console.log("inviteFetched:", inviteFetched[1]);
                return await interaction.reply({ ephemeral: true, content: `**Success**: Invite is alive, refresh is not needed.`});
            }
        } else if (interaction.customId == self.triggers[1]) {
            // console.log(`dummy button clicked by: "${interaction.user.id}", under "${interaction.message.id}"`);
            let messageContentParsed = {};
            if (0) console.log('interaction.message.content:', interaction.message.content);
            if ((interaction.message.content.includes(': **: ')) ||
                (interaction.message.content.includes('https'))) {
                console.log(client.g.chalk.log, 'Message contains some broken columns or data, fixing...');
            }
            let _content = interaction.message.content
                .replaceAll(': **: ', '**: ')
                .replaceAll('**:', ':')
                .replaceAll('**', '')
                .replaceAll('https', 'http')
                .split('\n');
            if (0) console.log('_content:', _content);
            for (let i = 0; i < _content.length; i++) {
                const element = _content[i].split(': ');
                messageContentParsed[element[0]] = element[1]; //messageContentParsed.push(element);
            }
            if (0) console.log('messageContentParsed:', messageContentParsed);
            if ((messageContentParsed['Server name'][0] != '`') || 
                (messageContentParsed['Server name'][messageContentParsed['Server name'].length - 1] != '`')) {
                //console.log('messageContentParsed (before):', messageContentParsed['Server name']);
                messageContentParsed['Server name'] = ((messageContentParsed['Server name'][0] != '`') ? ('`') : ('')) + messageContentParsed['Server name'];
                messageContentParsed['Server name'] += ((messageContentParsed['Server name'][messageContentParsed['Server name'].length - 1] != '`') ? ('`') : (''));
                //messageContentParsed['Server name'] = '`' + messageContentParsed['Server name'] + '`';
                //console.log('messageContentParsed (after):', messageContentParsed['Server name']);
                if (0) console.log('messageContentParsed:', messageContentParsed);
                let _out = '';
                for (const [key, value] of Object.entries(messageContentParsed)) {
                    _out += `**${key}**: ${value}\n`;
                }
                if (0) console.log('_out:', _out);
                await interaction.update({ content: _out });
                return await interaction.followUp({ ephemeral: true, content: `Some fixing processed.`});
            } else if (interaction.message.content.includes(': **: ')) {
                if (0) console.log('messageContentParsed:', messageContentParsed);
                let _out = '';
                for (const [key, value] of Object.entries(messageContentParsed)) {
                    _out += `**${key}**: ${value}\n`;
                }
                if (0) console.log('_out:', _out);
                await interaction.update({ content: _out });
                return await interaction.followUp({ ephemeral: true, content: `Some fixing processed.`});
            } else {
                console.log(client.g.chalk.log, 'Name escaping not needed, passing.');
            }
            return await interaction.reply({ ephemeral: true, content: `Nope. Not now. It's dummy button for now, but in the future all of this will be done better. Sorry.`});
        }
    },
    run: async (client, interaction) => {
        if (interaction.channel) {
            await interaction.channel.sendTyping();
        } else {
            let _channel = await client.channels.fetch(interaction.channelId);
            await _channel.sendTyping();
        }
        if (!(interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) && !(interaction.member.roles.resolveId(process.env.MASTER_LIBRARIANS_ROLE))) {
            return await interaction.reply({ ephemeral: true, content: `**Access denied**: Only librarian or admin allowed to do this.`});
        }
        //console.log('self:', self);
        //console.log('interaction:', interaction);
        
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
                /* if (e.message == "Unknown Invite" || inviteFetched.message.code == 10006 || e.message.httpStatus == '404') {
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
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId(self.triggers[0]) // 'submit-simple-check'
                .setLabel('Check')
                .setStyle('PRIMARY')
                .setEmoji('🔬'),
            new MessageButton()
                .setCustomId(self.triggers[1]) // 'submit-simple-convert'
                .setLabel('Convert')
                .setStyle('SECONDARY')
                .setEmoji('🚧'),
        );

        await client.channels.cache.get(process.env.MASTER_CHX_POSTING).send({
            content:
                Formatters.bold('Server name') + `: \`${inviteFetched.guild.name}\`\n` +
                Formatters.bold('Server ID') + `: ${inviteFetched.guild.id}\n` +
                ((messageLinkIn) ? (Formatters.bold('Source message') + `: ${messageLinkIn}\n`) : ('')) +
                Formatters.bold('Invite') + `: ${((inviteFetched.url) || ((inviteFetched.code) ? (`http://discord.gg/` + inviteFetched.code) : (`http://discord.gg/` + inviteFetched)))}`,
            components: [row]
        });
        return await interaction.reply({ ephemeral: true, content: `Ok.` });
    },
};