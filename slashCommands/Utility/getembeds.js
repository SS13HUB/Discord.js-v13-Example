

module.exports = {
    name: "getembeds",
    category: "Utility",
    options: [
        {
            name: 'id',
            description: 'ID of message you want to me to lookup',
            type: 'STRING',
            required: true
        }
    ],
    description: "Get embeds from message.",
    ownerOnly: false,
    run: async (client, interaction) => {
        if (interaction.channel) {
            await interaction.channel.sendTyping();
        } else {
            let _channel = await client.channels.fetch(interaction.channelId);
            await _channel.sendTyping();
        }
        const messageId = interaction.options.getString("id");
        if (!messageId) return interaction.reply({ content: `There is no any message IDs!` });

        await interaction.channel.messages.fetch(messageId)
            .then(() => {return;})
            .catch((e) => {return interaction.reply(`Error:\nCan not find message with this ID in this channel.`);});

        let _message = await interaction.channel.messages.fetch(messageId)
            .then((d) => {return [true, d]})
            .catch((e) => {return [false, e]});

        if (!_message[0]) {
            return interaction.reply(`Error:\n\`\`\`${e}\`\`\``);
        }

        if (_message[1].embeds == []) {
            return interaction.reply(`Error:\nNo embeds.`);
        }

        console.log(_message[1].embeds);

        const getEmbedsEmbed = new client.discord.MessageEmbed()
            .setDescription(`\`\`\`${JSON.stringify(_message[1].embeds, null, 4)}\`\`\``); // `In console.`

        return interaction.reply({ embeds: [getEmbedsEmbed] });

    },
};
