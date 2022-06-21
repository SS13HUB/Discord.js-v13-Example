
//


module.exports = {
    name: "get-bot-messages",
    category: "Utility",
    description: "Not for public use, sorry.",
    adminOnly: false,
    ownerOnly: false,
    doNotRegisterSlash: false,
    triggers: [],
    trigger: async () => {return;},
    run: async (client, interaction) => {
        if (interaction.channel) {
            await interaction.channel.sendTyping();
        } else {
            let _channel = await client.channels.fetch(interaction.channelId);
            await _channel.sendTyping();
        }

        const _messages = await interaction.channel.messages.fetch()
            .then(messages => {
                return messages.filter(m => m.author.id === client.user.id).map(m => m.url);
            })
            .catch(error => {return error});

        console.log(_messages);
        console.log(_messages.length);
        //console.log(_messages.keys());
        //console.log(Array.from(_messages.keys()));

        let _links = `None`;
        if (_messages.length > 0) {
            _links = ``;
            //let _messages_indexes = Array.from(_messages.keys());
            for (let i = 0; i < _messages.length; i++) {
                //_links += `https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${_messages[i]}${i >= _messages.length ? `\n` : ``}`;
                //_links = _links.concat(`https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${_messages.get([_messages_indexes[i]]).id}\n`);
                //_links += `${_messages[i]}\n`;
                _links = _links.concat(`${_messages[i]}\n`);
                //console.log(_messages[_messages_indexes[i]]);
                //break;
            }
            const limit = 2000 - 1;
            const message = "\nAnd another links...";
            _links = _links.slice(0, limit - message.length) + message;
        }

        console.log("_links:\n", _links);

        /* const debugEmbed = new client.g.discord.MessageEmbed()
            .setDescription(_links); */

        await interaction.reply({ content: _links });

    },
};
