
const { Permissions } = require('discord.js');

module.exports = {
    name: "getmyinvites",
    category: "Utility",
    description: "You can get your invites to this server.",
    ownerOnly: false,
    run: async (client, interaction) => {
        if (interaction.channel) {
            await interaction.channel.sendTyping();
        } else {
            let _channel = await client.channels.fetch(interaction.channelId);
            await _channel.sendTyping();
        }

        if (interaction.guild === undefined) return interaction.channel.send(`Error: Guild undefined.`);
        if (interaction.guild.me === undefined) return interaction.channel.send(`Error: I'm not on the server.`);
        if (!interaction.guild.me.permissions.has([Permissions.FLAGS.MANAGE_GUILD, Permissions.FLAGS.MANAGE_CHANNELS]))
            return interaction.channel.send(`Error: No Permission "MANAGE_GUILD" or "MANAGE_CHANNELS", I can't check invites.`);

        const guildInvites = await interaction.guild.invites.fetch()
            .then((data) => {return data})
            .catch((data) => {return data});

        //console.log(guildInvites);
        //await interaction.channel.send(`Check log`);

        /* var temp = [];
        for (let invite of guildInvites) {
            temp.push([invite[1].inviterId, invite[1].inviterId == interaction.user.id ? "+" : "-"]);
        }
        console.log("temp:", temp, interaction.user.id); */

        const guildInvitesFiltered = guildInvites
            .each(invite => invite.inviterId)
            .filter(invite => invite.inviterId == interaction.user.id);
        //console.log("guildInvitesFiltered:", guildInvitesFiltered);

        const guildInvitesEmbed = new client.discord.MessageEmbed()
            .setColor(client.config.embedColor)
            .setTitle(':chains: ・ Your invites to this server')

        if (guildInvitesFiltered.size > 0) {
            var count = 0;
            for (let invite of guildInvitesFiltered) {
                count += 1;
                guildInvitesEmbed.addField(`[${count}\\${guildInvitesFiltered.size}] ${invite[1].url}`,
                    `Max age: \`${(!invite[1].temporary || invite[1].maxAge == 0 ? invite[1].maxAge : "non-expiring")}\`;
                    Max uses: \`${(invite[1].maxUses > 0 ? "∞" : invite[1].maxUses)}\`;
                    To channel: ${(invite[1].channelId !== null ? "<#" + invite[1].channelId + ">" : "Unknown")}`)
            }
        }
        else {
            guildInvitesEmbed.setDescription(`No links detected by you as filer.`);
        }

    console.log(`[CMD] ${interaction.user.id} asks for invite fetch: (${interaction.guild.id})`);
    await interaction.reply({ embeds: [guildInvitesEmbed] });
    },
};
