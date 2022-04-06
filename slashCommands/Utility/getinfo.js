
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
                if (e.message == "Unknown Invite") return {"code": inviteCode, "message": e};
                return null;
        });
        if (fetchedInvite.message == "Unknown Invite") {
            const embed = new client.discord.MessageEmbed()
                .setTitle(':chains: Invite link info')
                .addField('Invite Code', `${fetchedInvite.code}`, true)
                .addField('Invite Status', `[${fetchedInvite.message}](https://discord.com/api/invite/${fetchedInvite.code}?with_counts=true&with_expiration=true)`, true)
                .addField('Reason', `Provided invite link was killed or not created yet.`)
                .setColor(client.config.embedColor)
            return interaction.reply({ embeds: [embed] });
            //return interaction.reply({ content: `Invite link is unknown! (was killed or not created yet)` });
        }
        if (fetchedInvite === null) {
            return interaction.reply({ content: `Error: ${e}; message:${e.message}` });
        }
        
        const embed = new client.discord.MessageEmbed()
            .setColor(client.config.embedColor)
            .setTitle(':chains: Invite link info')
            .setThumbnail(fetchedInvite.guild.iconURL())
            .addField('Invite Code', `[${fetchedInvite.code}](${fetchedInvite.url})`) //discord://-/invite/discord-testers 
            //.addField('Invite Type', `${fetchedInvite.type}`)
            .addField('Expires at', `${(fetchedInvite.expiresTimestamp === 0 ? "never" : fetchedInvite.expiresTimestamp)}`)
            //.addField('Invite max uses', `${fetchedInvite.maxUses}`)
            .addField('Server: ID', `${fetchedInvite.guild.id}`)
            .addField('Name', `${fetchedInvite.guild.name}`, true)
            .addField('Server Members: Total, Online, Offline', 
            `${fetchedInvite.memberCount}, ${fetchedInvite.presenceCount}, ${fetchedInvite.memberCount - fetchedInvite.presenceCount}`)
            //.addField('Server Members Online', `${fetchedInvite.presenceCount}`)
            //.addField('Server Members Offline', `${fetchedInvite.memberCount - fetchedInvite.presenceCount}`)
            .addField('Inviter', `${fetchedInvite.inviter}`)
            .addField('Open invite', `[Web browser](${fetchedInvite.url});\nSplash screen: <discord://-/invite/${fetchedInvite.code}>;\nDirect Go To: <discord://discord.gg/${fetchedInvite.code}>;`)
            .addField(`Is this bot presense on server?`, `${(client.guilds.cache.get(fetchedInvite.guild.id) !== undefined ? "yes" : "no")}`)
            .addField(`Is this bot can lookup invites on this server?`, `${(fetchedInvite.guild.me !== undefined ? (fetchedInvite.guild.me.permissions.has(Permissions.FLAGS.MANAGE_GUILD) ? "yes" : "no") : "not on server")}`); // MANAGE_GUILD
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
