
const { MessageFlags } = require('discord.js');


module.exports = {
    name: "get-message-content",
    category: "Utility",
    options: [
        {
            name: 'url',
            description: 'URL of message you want to me to lookup',
            type: 'STRING',
            required: true
        }
    ],
    description: "Get content and embeds from message.",
    adminOnly: false,
    ownerOnly: false,
    run: async (client, interaction) => {
        if (interaction.channel) {
            await interaction.channel.sendTyping();
        } else {
            let _channel = await client.channels.fetch(interaction.channelId);
            await _channel.sendTyping();
        }
        const messageLink = interaction.options.getString("url");
        if (!messageLink) return await interaction.reply({ ephemeral: true, content: `**Error**: There is no any message IDs!` });

        let messageSplitted = messageLink.split('/');
        console.log('messageLink:', messageLink);
        if (
            (messageSplitted.length != 7) ||
            (messageSplitted[2] != 'discord.com') ||
            (messageSplitted[3] != 'channels')
        ) {
            return await interaction.reply({ ephemeral: true, content: `**Error**: Only supported format:\n\`https://discord.com/channels/guildId/channelId/messageId\`` });
        }

        const _guild = client.guilds.cache.get(messageSplitted[4]);
        if (_guild === undefined) {
            return await interaction.reply({ ephemeral: true, content: `**Error**: I'm not on the server. Invite me first.` });
        }
        //console.log('_guild:', _guild);

        const _channel = _guild.channels.cache.get(messageSplitted[5]);
        if (_channel === undefined) {
            return await interaction.reply({ ephemeral: true, content: `**Error**: Can not find channel.` });
        }
        //console.log('_channel:', _channel);

        const _message = await _channel.messages.fetch(messageSplitted[6])
            .then((d) => {return [true, d]})
            .catch((e) => {return [false, e]});
        if (!_message[0]) {
            console.log('_message[1]', _message[1]);
            return await interaction.reply({ ephemeral: true, content: `**Error**: Can not find channel.` });
        }
        //console.log('_message[1]:', _message[1]);
        /* const getEmbedsEmbed = new client.discord.MessageEmbed()
            //.setTitle(`Message "[${messageSplitted[6]}](${messageLink})"`)
            .setDescription(`**Message [${messageSplitted[6]}](${messageLink})**\n\`\`\`json\n${JSON.stringify(_message[1], null, 1)}\`\`\``);

        return await interaction.reply({ embeds: [getEmbedsEmbed] }); */
        const _messageToOut = JSON.stringify(_message[1], null, 1);
            // .replace('discord.gg', '_invite_redacted_')
            // .replace('discord.com/invite', '_invite_redacted_');
        await interaction.reply({
            flags: MessageFlags.FLAGS.SUPPRESS_EMBEDS,
            content: `**Message [${messageSplitted[6]}](${messageLink})**\n\`\`\`json\n${_messageToOut}\`\`\``
        });
        const _mess = await interaction.channel.messages.fetch(interaction.channel.lastMessageId)
            .then((d) => {return [true, d]})
            .catch((e) => {return [false, e]});
        //console.log('_mess:', _mess);
        //console.log('_messageToOut:', _messageToOut);
        if (!_mess[0]) {
            return;
        }
        return await _mess[1].suppressEmbeds();
    },
};
