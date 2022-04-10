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
    ownerOnly: true,
    run: async (client, interaction) => {
        const messageId = interaction.options.getString("id");
        if (!messageId) return interaction.reply({ content: `There isn't any message IDs!` });

        await msg.channel.messages.fetch(messageId)
            .then(message => console.log(message.content))
            .catch(console.error);

        const getEmbedsEmbed = new client.discord.MessageEmbed()
            .setDescription(`In console.`);

        await interaction.reply({ embeds: [getEmbedsEmbed] });

    },
};
