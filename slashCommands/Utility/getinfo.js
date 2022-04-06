
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
        if (fetchedInvite.message !== undefined) {
            if (fetchedInvite.message == "Unknown Invite" || fetchedInvite.message.code == 10006 || fetchedInvite.message.httpStatus == 404) {
                const embedInvite = new client.discord.MessageEmbed()
                    .setTitle(':chains: ・ Invite link info')
                    .addField('Invite Code', `[${fetchedInvite.code}](https://discord.com/api/invite/${fetchedInvite.code}?with_counts=true&with_expiration=true)`, true)
                    .addField('Invite Status', `${fetchedInvite.message}`, true) // :coffin:
                    .addField('Reason', `[Provided invite link](https://discord.gg/${fetchedInvite.code}) was deleted by human, expired or not been created yet.`)
                    .addField('Possible Solution', `Ask for new one... OR: 
                    Check[WayBack Machine](https://web.archive.org/*/https://discord.gg/${fetchedInvite.code})... (ToDo)`)
                    .setColor(client.config.embedColor)
                console.log(`[CMD] ${interaction.client.user.id} asks for invite info: ${fetchedInvite.code} (dead, ${fetchedInvite.message})`);
                const embedWidget = new client.discord.MessageEmbed()
                    .setColor(client.config.embedColor)
                    .setTitle(':mirror: ・ Widget info') // :anchor:
                    .addField('Widget Status', `N\\A`)
                return interaction.reply({ embeds: [embedInvite, embedWidget] });
                //return interaction.reply({ content: `Invite link is unknown! (was killed or not created yet)` });
            }
        }
        if (fetchedInvite === null) {
            return interaction.reply({ content: `Error: ${e}; message:${e.message}` });
        }
        
        const embedInvite = new client.discord.MessageEmbed()
            .setColor(client.config.embedColor)
            .setTitle(':chains: ・ Invite link info') // :anchor:
            .setThumbnail(fetchedInvite.guild !== undefined ? fetchedInvite.guild.iconURL() : "https://discord.js.org/static/djs_logo.png")
            .addField('Invite Code, Expires at', `[${fetchedInvite.code}](${fetchedInvite.url}), ${(fetchedInvite.expiresTimestamp === 0 ? (fetchedInvite.guild.vanityURLCode === null ? "never" : "vanity links doesn't expires") : fetchedInvite.expiresTimestamp)}`) //discord://-/invite/discord-testers 
            //.addField('Invite Type', `${fetchedInvite.type}`)
            //.addField('Invite max uses', `${fetchedInvite.maxUses}`)
            .addField('Channel', `${fetchedInvite.channel}, \`<#${fetchedInvite.channel.id}>\``)
            .addField('Server ID', `${fetchedInvite.guild.id}`, true)
            .addField('Members: Total, Online, Offline', 
            `${fetchedInvite.memberCount}, ${fetchedInvite.presenceCount}, ${fetchedInvite.memberCount - fetchedInvite.presenceCount}`, true)
            .addField('Server Name', `${fetchedInvite.guild.name}`)
            .addField('Server Description', `${(fetchedInvite.guild.description !== null ? fetchedInvite.guild.description : "no description")}`)
            .addField('Server Vanity URL Code', `${(fetchedInvite.guild.vanityURLCode !== null ? fetchedInvite.guild.vanityURLCode : "no vanity code")}`)
            .addField('Inviter', `${(fetchedInvite.guild.vanityURLCode === null ? fetchedInvite.inviter : "vanity links doesn't have inviters")}`)
            .addField('Server King (Owner)',
            `${(client.guilds.cache.get(fetchedInvite.guild.id) !== undefined ? await fetchedInvite.guild.fetchOwner()
                .then((data) => {return data;})
                .catch((e) => {return "unable to locate King: " + e;})
                : "I'm not on the server")}`)
            .addField('Open invite',
            `[Web browser](${fetchedInvite.url}) ([API](https://discord.com/api/invite/${fetchedInvite.code}?with_counts=true&with_expiration=true));
            Splash screen: <discord://-/invite/${fetchedInvite.code}>;\nDirect Go To: <discord://discord.gg/${fetchedInvite.code}>;`)
            .addField(`Is this bot presense on server?`, `${(client.guilds.cache.get(fetchedInvite.guild.id) !== undefined ? "yes" : "no")}`, true)
            .addField(`And can lookup invites here?`, `${(fetchedInvite.guild.me !== undefined ? (fetchedInvite.guild.me.permissions.has(Permissions.FLAGS.MANAGE_GUILD) ? "yes" : "no") : "I'm not on the server")}`, true); // MANAGE_GUILD

        console.log(`[CMD] ${interaction.client.user.id} asks for invite info: ${fetchedInvite.code} (${fetchedInvite.guild.id})`);

        /* if (client.guilds.cache.get(fetchedInvite.guild.id) === undefined) {
            const embedWidget = new client.discord.MessageEmbed()
                .setColor(client.config.embedColor)
                .setTitle(':mirror: ・ Widget info') // :anchor:
                .addField('Widget',
                `[URL](https://discord.com/widget?id=${fetchedInvite.guild.id}&theme=dark), [API 1](https://discord.com/api/guilds/${fetchedInvite.guild.id}/widget.json), [API 2](https://discord.com/api/guilds/${fetchedInvite.guild.id}/embed.json)`, true)
                .addField('Widget Status', `-`, true)
                .setThumbnail(fetchedInvite.guild.iconURL())
            console.log(`[CMD] ${interaction.client.user.id} asks for invite info: ${fetchedInvite.code} (dead, ${fetchedInvite.message})`);
            return interaction.reply({ embeds: [embed] });
        } */
        //console.log(fetchedInvite);
        const fetchedWidget = await fetchedInvite.guild.fetchWidget() //fetchWidgetSettings
            .then((data) => {
                return data;
            })
            .catch((e) => {
                console.log(e);
                return null;
        });
        //console.log(fetchedWidget);
        /* const embedWidget = new client.discord.MessageEmbed()
            .setColor(client.config.embedColor)
            .setTitle(':mirror: ・ Widget info') // :anchor:
            .setThumbnail(fetchedInvite.guild.iconURL())
            .addField('fetchedInvite.guild', `${fetchedInvite.guild.()}`) */
            //.addField('Invite Type', `${fetchedInvite.type}`)
        //console.log(fetchedInvite);
        await interaction.reply({ embeds: [embedInvite] });
    },
};
