
const { Permissions, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: "save2db",
    category: "Database",
    options: [
        {
            name: 'invite_or_ID',
            description: 'invite (link or code), channel ID or server ID.',
            type: 'STRING',
            required: false
        }
    ],
    description: "Not for public use, sorry.",
    ownerOnly: true,
    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply({ content: `You can only add servers with ADMINISTRATOR authorization.` });
        const param1 = interaction.options.getString("invite_or_ID");
        if (!param1) return interaction.reply({ content: `There isn't any invite link, channel ID or server ID!` });
        
        console.log(`[CMD] ${interaction.user.id} trigger invite2button: (${fetchedInvite.code})`); //${(fetchedWidget !== undefined ? fetchedWidget.id : "widget unknown")}
        //console.log(fetchedWidget.channels.map((channel) => [channel.id, channel.name]));
        //console.log(fetchedWidget.channels.mapValues((channel) => [channel.id, channel.name]));
        await interaction.reply({ embeds: [inviteToButtonInvite], components: [row] });
    },
};
