
const { Permissions } = require('discord.js');

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
    name: "getinfo",
    usage: '/getinfo <invite link>',
    options: [
        {
            name: 'invite',
            description: 'Invite link you want to me to lookup',
            type: 'STRING',
            required: true
        }
    ],
    category: "Utility",
    description: "I will try to get information about your invite link.",
    ownerOnly: false,
    run: async (client, interaction) => {
        if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ content: `You can only add servers with ADMINISTRATOR authorization.` });
        const inviteCode = interaction.options.getString("invite");
        if (!inviteCode) return interaction.reply({ content: `There isn't any invite link!` });
        
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
        if (fetchedInvite.message == "Unknown Invite" || fetchedInvite.message.code == 10006 || fetchedInvite.message.httpStatus == 404) {
            const embed = new client.discord.MessageEmbed()
                .setTitle(':chains: ・ Invite link info')
                .addField('Invite Code', `[${fetchedInvite.code}](https://discord.com/api/invite/${fetchedInvite.code}?with_counts=true&with_expiration=true)`, true)
                .addField('Invite Status', `${fetchedInvite.message}`, true) // :coffin:
                .addField('Reason', `[Provided invite link](https://discord.gg/${fetchedInvite.code}) was deleted or was not created yet.`)
                .addField('Possible Solution', `Ask for new one... OR: [Check WayBack Machine](https://web.archive.org/*/https://discord.gg/${fetchedInvite.code})... (ToDo)`)
                .setColor(client.config.embedColor)
            console.log(`[CMD] ${interaction.client.user.id} asks for invite info: ${fetchedInvite.code} (dead, ${fetchedInvite.message})`);
            return interaction.reply({ embeds: [embed] });
            //return interaction.reply({ content: `Invite link is unknown! (was killed or not created yet)` });
        }
        if (fetchedInvite === null) {
            return interaction.reply({ content: `Error: ${e}; message:${e.message}` });
        }
        
        const embed = new client.discord.MessageEmbed()
            .setColor(client.config.embedColor)
            .setTitle(':chains: ・ Invite link info') // :anchor:
            .setThumbnail(fetchedInvite.guild !== undefined ? fetchedInvite.guild.iconURL() : "https://discord.js.org/static/djs_logo.png")
            .addField('Invite Code, Expires at', `[${fetchedInvite.code}](${fetchedInvite.url}), ${(fetchedInvite.expiresTimestamp === 0 ? "never" : fetchedInvite.expiresTimestamp)}`) //discord://-/invite/discord-testers 
            //.addField('Invite Type', `${fetchedInvite.type}`)
            //.addField('Invite max uses', `${fetchedInvite.maxUses}`)
            .addField('Server: ID', `${fetchedInvite.guild.id}`, true)
            .addField('Name', `${fetchedInvite.guild.name}`, true)
            .addField('Members: Total, Online, Offline', 
            `${fetchedInvite.memberCount}, ${fetchedInvite.presenceCount}, ${fetchedInvite.memberCount - fetchedInvite.presenceCount}`)
            .addField('Server description', `${fetchedInvite.guild.description}`)
            .addField('Server vanity url code', `${fetchedInvite.vanityURLCode}`)
            .addField('Channel', `${fetchedInvite.channel}`)
            .addField('Channel ID', `${fetchedInvite.channelId}`)
            .addField('Channel Name', `${fetchedInvite.channel.name}`)
            .addField('Inviter', `${fetchedInvite.inviter}`)
            .addField('Open invite',
            `[Web browser](${fetchedInvite.url}) ([API](https://discord.com/api/invite/${fetchedInvite.code}?with_counts=true&with_expiration=true));
            Splash screen: <discord://-/invite/${fetchedInvite.code}>;\nDirect Go To: <discord://discord.gg/${fetchedInvite.code}>;`)
            .addField(`Is this bot presense on server?`, `${(client.guilds.cache.get(fetchedInvite.guild.id) !== undefined ? "yes" : "no")}`, true)
            .addField(`And can lookup invites here?`, `${(fetchedInvite.guild.me !== undefined ? (fetchedInvite.guild.me.permissions.has(Permissions.FLAGS.MANAGE_GUILD) ? "yes" : "no") : "I'm not on the server")}`, true); // MANAGE_GUILD
            //.setImage(fetchedInvite.guild.iconURL())
            //.setFooter({ text: `Open invite: [Web](${fetchedInvite.url}) [Splash screen](discord://-/invite/${fetchedInvite.code}) [Direct Go To](discord://discord.gg/${fetchedInvite.code})` });

            console.log(`[CMD] ${interaction.client.user.id} asks for invite info: ${fetchedInvite.code} (${fetchedInvite.guild.id})`);
            /* console.log(`${client.guilds.cache.get(854664216739577867)}`);
            console.log(`${client.guilds.cache.get(fetchedInvite.guild.id)}`);
            console.log(`${client.guilds.cache.get('854664216739577867')}`);
            console.log(`${client.guilds.cache.get(toString(fetchedInvite.guild.id))}`);
            console.log(`${client.guilds.cache.get("'"+fetchedInvite.guild.id+"'")}`); */
        //console.log(fetchedInvite);
        await interaction.reply({ embeds: [embed] });
    },
};
