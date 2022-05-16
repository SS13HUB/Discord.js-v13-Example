// Example of how to make a SlashCommand

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
        await interaction.channel.sendTyping();
        const messageId = interaction.options.getString("id");
        if (!messageId) return interaction.reply({ content: `There is no any message IDs!` });

        await interaction.channel.messages.fetch(messageId)
            .then(message => console.log(message.content))
            .catch(console.error);

        const getEmbedsEmbed = new client.discord.MessageEmbed()
            .setDescription(`In console.`);

        await interaction.reply({ embeds: [getEmbedsEmbed] });

    },
};
