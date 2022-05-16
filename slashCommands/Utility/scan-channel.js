
const { SlashCommandBuilder } = require('@discordjs/builders'); // require('discord.js');

module.exports = {
    name: "scan-channel",
    category: "Utility",
    description: "I'll scan the channel for invite links and save them.",
    ownerOnly: false,
    options: [
        {
            name: 'channel',
            description: 'Target channel ID or link. I must be on this server!',
            type: 'STRING',
            required: true
        }
    ],
    run: async (client, interaction) => {
        await interaction.channel.sendTyping();
        //if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply({ content: `You can only add servers with ADMINISTRATOR authorization.` });
        const channelInput = interaction.options.getString("channel");
        if (!channelInput) return interaction.reply({ content: `There is no any channel ID or link!` });

        if (typeof channelInput !== "string") channelInput = `${channelInput}`;

        let isChannel = await client.channels.fetch(channelInput)
            .then((d) => {return d})
            .catch(() => {return false});

        console.log(`[CMD] ${interaction.user.id} trigger scan-channel: (${channelInput})`);

        if (!isChannel) {
            const savetodatabaseEmbed = new client.discord.MessageEmbed()
                .setTitle('Scan channel — status (failure)')
                .setDescription(`I detect no any channel ID or link.`)
                .setColor(client.config.embedColor);
            return interaction.reply({ embeds: [savetodatabaseEmbed] });
        }
        let amImOnServer = await client.guilds.cache.get(isChannel.guild.id) !== undefined;
        if (!amImOnServer) {
            const savetodatabaseEmbed = new client.discord.MessageEmbed()
                .setTitle('Scan channel — status (failure)')
                .setDescription(`I detect channel, but I'm not on the server. Invite me first and retry.`)
                .setColor(client.config.embedColor);
            return interaction.reply({ embeds: [savetodatabaseEmbed] });
        }
        if (!isChannel.viewable) {
            const savetodatabaseEmbed = new client.discord.MessageEmbed()
                .setTitle('Scan channel — status (failure)')
                .setDescription(`I detect channel and I'm on the server, but I can not read it. Give me permissions and retry.`)
                .setColor(client.config.embedColor);
            return interaction.reply({ embeds: [savetodatabaseEmbed] });
        }
        if (!(isChannel.isText() || isChannel.isThread())) {
            const savetodatabaseEmbed = new client.discord.MessageEmbed()
                .setTitle('Scan channel — status (failure)')
                .setDescription(`I detect channel, I'm on the server, but I can read only text and tread channels. Give me another ID.`)
                .setColor(client.config.embedColor);
            return interaction.reply({ embeds: [savetodatabaseEmbed] });
        }

        const savetodatabaseEmbed = new client.discord.MessageEmbed()
            .setTitle('Scan channel — status (success)')
            .setDescription(`I detect channel. Please check console.`)
            .setColor(client.config.embedColor);
        let fetchInvites = await isChannel.fetchInvites( {"cache": false} );
        console.log("fetchInvites", fetchInvites);
        return interaction.reply({ embeds: [savetodatabaseEmbed] });
    },
};
