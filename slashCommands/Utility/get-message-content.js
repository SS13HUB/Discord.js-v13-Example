

module.exports = {
    name: "get-message-content",
    category: "Utility",
    options: [
        {
            name: 'id',
            description: 'ID of message you want to me to lookup',
            type: 'STRING',
            required: true
        }
    ],
    description: "Get content and embeds from message.",
    ownerOnly: false,
    run: async (client, interaction) => {
        if (interaction.channel) {
            await interaction.channel.sendTyping();
        } else {
            let _channel = await client.channels.fetch(interaction.channelId);
            await _channel.sendTyping();
        }
        const messageId = interaction.options.getString("id");
        if (!messageId) return await interaction.reply({ ephemeral: true, content: `**Error**: There is no any message IDs!` });

        // Fetch all channels from the guild (excluding threads)
        // message.guild.channels.fetch()
        //console.log('interaction.guild.channels:', interaction.guild);
        let _channels = [];
        let channels = client.channels.cache
            .filter((chx) => chx.type === "GUILD_TEXT");
        //console.log('channels:', channels);
        for (const channel of channels.values()) {
            _channels.push(channel);
            //console.log(channel.id);
        }
        //[...interaction.guild.channels];
        // interaction.guild.channels.array()
        //console.log('_channels:', _channels.map((chx) => chx.id));
        console.log(`Searching in ${_channels.length} channels.`);
        let _message;
        for (let i = 0; i < _channels.length; i++) {
            const _channel = _channels[i];
            //console.log('_channel:', _channel);
            //console.log('_channel.messages:', _channel.messages);
            //_message = _channel.messages.resolve(messageId);
            //console.log('_channel.messages.resolve(messageId):', _channel.guild.id, _channel.id, (i + 1), _channel.messages.resolve(messageId));
            _message = await _channel.messages.fetch(messageId)
                .then((d) => {return [true, d]})
                .catch((e) => {return [false, e]});
            if (_message[0]) break;
            //if (_message !== null) break;
        }

        if (!_message[0]) return await interaction.reply({ ephemeral: true, content: `**Error**: Can not find message with this ID in this server.` });
        console.log('_message[1]:', _message[1]);
        /* await interaction.channel.messages.fetch(messageId)
            .then(() => {return;})
            .catch(async (e) => {
                console.error(e);
                return await interaction.reply({ ephemeral: true, content: `**Error**: Can not find message with this ID in this channel.` });
            }); */

        /* let _message = await interaction.channel.messages.fetch(messageId)
            .then((d) => {return [true, d]})
            .catch((e) => {return [false, e]}); */

        if (!_message[0]) {
            return interaction.reply(`Error:\n\`\`\`${e}\`\`\``);
        }

        /* if (_message[1].embeds.length == 0) {
            return interaction.reply(`Error:\nNo embeds.`);
        } */

        console.log(_message[1]); //.embeds

        const getEmbedsEmbed = new client.discord.MessageEmbed()
            .setDescription(`\`\`\`${JSON.stringify(_message[1].embeds, null, 4)}\`\`\``); // `In console.`

        return interaction.reply({ embeds: [getEmbedsEmbed] });

    },
};
