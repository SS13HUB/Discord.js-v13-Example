
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
    name: "get-info",
    usage: '/get-info <invite link>',
    options: [
        {
            name: 'invite',
            description: 'Invite link you want to me to lookup\n("https://discord.gg/CODE" or "CODE" without quotes)',
            type: 'STRING',
            required: true
        }
    ],
    category: "Utility",
    description: "I will try to get information about your invite link (few possiable formats avaliable).",
    adminOnly: false,
    ownerOnly: false,
    doNotRegisterSlash: false,
    triggers: [],
    trigger: async () => {return;},
    run: async (client, interaction) => {
        if (interaction.channel) {
            await interaction.channel.sendTyping();
        } else {
            let _channel = await client.channels.fetch(interaction.channelId);
            await _channel.sendTyping();
        }
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
                const embedInvite = new client.g.discord.MessageEmbed()
                    .setTitle(':chains: ・ Invite link info')
                    .addField('Invite Code', `[${fetchedInvite.code}](https://discord.com/api/invite/${fetchedInvite.code}?with_counts=true&with_expiration=true)`, true)
                    .addField('Invite Status', `${fetchedInvite.message}`, true) // :coffin:
                    .addField('Reason', `[Provided invite link](https://discord.gg/${fetchedInvite.code}) was deleted by human, expired or not been created yet.`)
                    .addField('Possible Solution', `Ask for new one... OR: 
                    Check[WayBack Machine](https://web.archive.org/*/https://discord.gg/${fetchedInvite.code})... (ToDo)`)
                    .setColor(client.g.config.embedColor)
                console.log(`[CMD] ${interaction.user.id} asks for invite info: ${fetchedInvite.code} (dead, ${fetchedInvite.message})`);
                const embedWidget = new client.g.discord.MessageEmbed()
                    .setColor(client.g.config.embedColor)
                    .setTitle(':mirror: ・ Widget info') // :anchor:
                    .addField('Widget Status', `N\\A`)
                return interaction.reply({ embeds: [embedInvite, embedWidget] });
                //return interaction.reply({ content: `Invite link is unknown! (was killed or not created yet)` });
            }
        }
        if (fetchedInvite === null) {
            console.log('Invite checked, it\'s not alive.');
            return interaction.reply({ content: `Error: Message: ${e.message}\n${e}` });
        }
        
        const embedInvite = new client.g.discord.MessageEmbed()
            .setColor(client.g.config.embedColor)
            .setTitle(':chains: ・ Invite link info') // :anchor:
            .setThumbnail(fetchedInvite.guild !== undefined ? fetchedInvite.guild.iconURL() : "https://discord.js.org/static/djs_logo.png")
            .addField('Invite Code, Expires at',
            `[${fetchedInvite.code}](${fetchedInvite.url}), ${(fetchedInvite.expiresTimestamp === 0 ? (fetchedInvite.guild.vanityURLCode === null ? "∞" : "vanity links doesn't expires") : fetchedInvite.expiresTimestamp)}`) //discord://-/invite/discord-testers 
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
            .addField(`And can lookup invites here?`,
            `${(
                fetchedInvite.guild.me !== undefined ?
                    (fetchedInvite.guild.me.permissions.has([Permissions.FLAGS.MANAGE_GUILD, Permissions.FLAGS.MANAGE_CHANNELS]) ?
                        "yes" : "no") :
                    "I'm not on the server"
                )}`, true)
            .addField(`And can create new?`,
            `${(
                interaction.guild ?
                    interaction.guild.me !== undefined ?
                        (interaction.guild.me.permissions.has([
                                Permissions.FLAGS.MANAGE_GUILD,
                                Permissions.FLAGS.MANAGE_CHANNELS,
                                Permissions.FLAGS.CREATE_INSTANT_INVITE
                            ]) ?
                            "yes" : "no") :
                        "I'm not on the server" :
                    "There is no server. Is this DM?"
            )}`, true);

        console.log(`[CMD] ${interaction.user.id} asks for invite info: ${fetchedInvite.code} (${fetchedInvite.guild.id})`);
        if (interaction.guild) {
            //let collection = fetchedInvite.guild
            //// console.debug({...interaction.guild});
            //console.debug(fetchedInvite.guild);
            //console.debug(...tmp.values());
            //// return;
        }

        /* if (client.guilds.cache.get(fetchedInvite.guild.id) === undefined) {
            const embedWidget = new client.g.discord.MessageEmbed()
                .setColor(client.g.config.embedColor)
                .setTitle(':mirror: ・ Widget info') // :anchor:
                .addField('Widget',
                `[URL](https://discord.com/widget?id=${fetchedInvite.guild.id}&theme=dark), [API 1](https://discord.com/api/guilds/${fetchedInvite.guild.id}/widget.json), [API 2](https://discord.com/api/guilds/${fetchedInvite.guild.id}/embed.json)`, true)
                .addField('Widget Status', `-`, true)
                .setThumbnail(fetchedInvite.guild.iconURL())
            console.log(`[CMD] ${interaction.user.id} asks for invite info: ${fetchedInvite.code} (dead, ${fetchedInvite.message})`);
            return interaction.reply({ embeds: [embed] });
        } */
        //console.log(fetchedInvite.guild);
        if (fetchedInvite.guild !== undefined) {
            if (fetchedInvite.guild.widgetEnabled) { //fetchWidgetSettings().then((d) => {return d.enabled;}).catch((e) => {return e;})) {
                //.then(widget => console.log(`The widget is ${widget.enabled ? 'enabled' : 'disabled'}`))) {
                const fetchedWidget = await fetchedInvite.guild.fetchWidget() //fetchWidgetSettings
                    .then((data) => {
                        return data;
                    })
                    .catch((e) => {
                        console.log(e);
                        return null;
                });
                const embedWidget = new client.g.discord.MessageEmbed()
                    .setColor(client.g.config.embedColor)
                    .setTitle(':mirror: ・ Widget info') // :anchor:
                    .setThumbnail(fetchedInvite.guild.iconURL())
                    .addField('id', `${fetchedWidget.id}`)
                    .addField('name', `${fetchedWidget.name}`)
                    .addField('instantInvite', `${await client.fetchInvite(fetchedWidget.instantInvite).then((d) => {return d}).catch((e) => {return e})}\n**Channels**:`)
                for (let value of fetchedWidget.channels.map((channel) => [channel.id, channel.name])) {
                    embedWidget.addField(`\`<#${value[0]}>\``, `[${value[1]}](https://discord.com/channels/${fetchedInvite.guild.id}/${value[0]})`) //`${[...fetchedWidget.channels.keys()]}`)
                }
                await interaction.reply({ embeds: [embedInvite, embedWidget] });
            } else {
                const embedWidget = new client.g.discord.MessageEmbed()
                    .setColor(client.g.config.embedColor)
                    .setTitle(':mirror: ・ Widget info') // :anchor:
                    .addField('Widget Status', `N\\A`)
                await interaction.reply({ embeds: [embedInvite, embedWidget] });
            }
        } else {
            const embedWidget = new client.g.discord.MessageEmbed()
                .setColor(client.g.config.embedColor)
                .setTitle(':mirror: ・ Widget info') // :anchor:
                .addField('Widget Status', `No server provided`)
            await interaction.reply({ embeds: [embedInvite, embedWidget] });
        }
        return console.log(`[CMD] ${interaction.user.id} asks for widget info: (${fetchedInvite.guild.id})`); //${(fetchedWidget !== undefined ? fetchedWidget.id : "widget unknown")}
        //console.log(fetchedWidget.channels.map((channel) => [channel.id, channel.name]));
        //console.log(fetchedWidget.channels.mapValues((channel) => [channel.id, channel.name]));
        //await interaction.reply({ embeds: [embedInvite, embedWidget] });
    },
};
