
const { Permissions } = require('discord.js');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const chalkMy = require(process.cwd() + "/src/chalk");

/* async function _fetchInvite(client, invite) {
    try {
        const fetchedInvite = await client.fetchInvite(invite);
        return fetchedInvite;
    } catch (e) {
        if (e.reason == 'Unknown Invite' || e.httpStatus == '404' || !e.ok) {
            interaction.reply({ content: `Invite link is unknown! (was killed or not created yet)` });
        } else {
            throw e;
        }
        return e;
    }
} */

module.exports = {
    name: "invitetobutton",
    usage: '/invitetobutton <invite link>',
    options: [
        {
            name: 'invite',
            description: 'Invite you want to me to convert to button\n("https://discord.gg/CODE" or "CODE" without quotes)',
            type: 'STRING',
            required: true
        }
    ],
    category: "Utility",
    description: "I will try to convert your invite link to button (few possiable formats avaliable).",
    ownerOnly: false,
    run: async (client, interaction) => {
        if (interaction.channel) {
            await interaction.channel.sendTyping();
        } else {
            let _channel = await client.channels.fetch(interaction.channelId);
            await _channel.sendTyping();
        }
        //if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply({ content: `You can only add servers with ADMINISTRATOR authorization.` });
        const inviteCode = interaction.options.getString("invite");
        if (!inviteCode) return interaction.reply({ content: `There is no any invite link!` });
        
        //const fetchedInvite = await _fetchInvite(client, inviteCode); //('https://discord.gg/djs')
        //const fetchedInvite = await client.fetchInvite(inviteCode);
        const fetchedInvite = await client.fetchInvite(inviteCode)
            .then((data) => {
                return data;
            })
            .catch((e) => {
                if (e.message == "Unknown Invite" || fetchedInvite.message.code == 10006 || e.message.httpStatus == '404') {
                    return {"code": inviteCode, "message": e};
                }
                return null;
        });
        if (fetchedInvite.message !== undefined) {
            if (fetchedInvite.message == "Unknown Invite" || fetchedInvite.message.code == 10006 || fetchedInvite.message.httpStatus == 404) {
                const inviteToButtonInvite = new client.discord.MessageEmbed()
                    .setTitle(':chains: ・ Invite link info')
                    .addField('Invite Code', `[${fetchedInvite.code}](https://discord.com/api/invite/${fetchedInvite.code}?with_counts=true&with_expiration=true)`, true)
                    .addField('Invite Status', `${fetchedInvite.message}`, true) // :coffin:
                    .setColor(client.config.embedColor)
                console.log(chalkMy.cmd, `${interaction.user.id} trigger invitetobutton: ${fetchedInvite.code} (dead, ${fetchedInvite.message})`);
                return interaction.reply({ embeds: [inviteToButtonInvite], ephemeral: true });
                //return interaction.reply({ content: `Invite link is unknown! (was killed or not created yet)` });
            }
        }
        if (fetchedInvite === null) {
            return interaction.reply({ content: `Error: ${e}; message:${e.message}` });
        }
        
        const inviteToButtonInvite = new client.discord.MessageEmbed()
            .setColor(client.config.embedColor)
            .setTitle(':chains: ・ Invite link to button') // :anchor:
            .addField('Invite Code', `[${fetchedInvite.code}](https://discord.com/api/invite/${fetchedInvite.code}?with_counts=true&with_expiration=true)`, true)
            //.setDescription(`Check button below.`);

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    //.setCustomId('invitetobutton_primary')
                    .setLabel(fetchedInvite.code)
                    .setURL(`${fetchedInvite.url}?with_counts=true&with_expiration=true`)
                    .setStyle('LINK'),
            );

        /* if (client.guilds.cache.get(fetchedInvite.guild.id) === undefined) {
            const embedWidget = new client.discord.MessageEmbed()
                .setColor(client.config.embedColor)
                .setTitle(':mirror: ・ Widget info') // :anchor:
                .addField('Widget',
                `[URL](https://discord.com/widget?id=${fetchedInvite.guild.id}&theme=dark), [API 1](https://discord.com/api/guilds/${fetchedInvite.guild.id}/widget.json), [API 2](https://discord.com/api/guilds/${fetchedInvite.guild.id}/embed.json)`, true)
                .addField('Widget Status', `-`, true)
                .setThumbnail(fetchedInvite.guild.iconURL())
            console.log(`[CMD] ${interaction.user.id} trigger invitetobutton: (${fetchedInvite})`);
            return interaction.reply({ embeds: [embed] });
        } */
        console.log(`[CMD] ${interaction.user.id} trigger invitetobutton: (${fetchedInvite.code})`); //${(fetchedWidget !== undefined ? fetchedWidget.id : "widget unknown")}
        //console.log(fetchedWidget.channels.map((channel) => [channel.id, channel.name]));
        //console.log(fetchedWidget.channels.mapValues((channel) => [channel.id, channel.name]));
        await interaction.reply({ content: fetchedInvite.url, embeds: [inviteToButtonInvite], components: [row] });
    },
};
