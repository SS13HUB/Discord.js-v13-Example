
const { Permissions, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: "save2db",
    category: "Utility",
    options: [
        {
            name: 'invite_or_ID',
            description: 'invite (link or code), channel ID or server ID.', // ToDo: .fetchWebhook(idtoken)
            type: 'STRING',
            required: true
        }
    ],
    description: "I will try to fetch it and save information in my database.",
    ownerOnly: true,
    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply({ content: `You can only add servers with ADMINISTRATOR authorization.` });
        const param1 = interaction.options.getString("invite_or_ID");
        if (!param1) return interaction.reply({ content: `There isn't any invite link, channel ID or server ID!` });

        if (typeof param1 !== "string") para1 = `${param1}`;

        var isInvite = client.fetchInvite(param1)
            .then((d) => {return d})
            .catch(() => {return false});

        var isChannel = message.guild.channels.fetch(param1)
            .then((d) => {return d})
            .catch(() => {return false});

        var isServer = client.guilds.fetch(param1)
            .then((d) => {return d})
            .catch(() => {return false});

        const saveToDBEmbed = new client.discord.MessageEmbed()
            .setTitle('Save to DB')
            .addField("isInvite", `${isInvite}`)
            .addField("isChannel", `${isChannel}`)
            .addField("isServer", `${isServer}`)
            .setColor(client.config.embedColor);

        console.log(`[CMD] ${interaction.user.id} trigger saveToDBEmbed: (${(param1 != null ? param1 : null)})`); //${(fetchedWidget !== undefined ? fetchedWidget.id : "widget unknown")}
        //console.log(fetchedWidget.channels.map((channel) => [channel.id, channel.name]));
        //console.log(fetchedWidget.channels.mapValues((channel) => [channel.id, channel.name]));
        await interaction.reply({ embeds: [saveToDBEmbed] });
    },
};
