
const { SlashCommandBuilder } = require('@discordjs/builders'); // require('discord.js');

/* async function _isInvite(client, _fetchMessages) {
    _fetchMessages.forEach((message) => {
        //if (message.embeds.length <= 0) return;
        if (message.content.length <= 0) return;
        let contents = message.content.split(' ');
        for (let i = 0; i < contents.length; i++) {
            if (i > 3) {return false;}
            const content = contents[i];
            let isInvite = client.fetchInvite(content)
                .then(() => {return true})
                .catch(() => {return false});
            if (isInvite) {
                console.log(message.url, content);
            }
        }
    });
} */

module.exports = {
    name: "scan-channel",
    category: "Utility",
    description: "I'll scan the channel for invite links and save them.",
    adminOnly: false,
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
        if (interaction.channel) {
            await interaction.channel.sendTyping();
        } else {
            let _channel = await client.channels.fetch(interaction.channelId);
            await _channel.sendTyping();
        }
        const channelInput = interaction.options.getString("channel");
        if (!channelInput) return interaction.reply({ content: `There is no any channel ID or link!` });

        if (typeof channelInput !== "string") channelInput = `${channelInput}`;

        let isChannel = await client.channels.fetch(channelInput)
            .then((d) => {return d})
            .catch(() => {return false});

        console.log(`[CMD] ${interaction.user.id} trigger scan-channel: (${channelInput})`);

        if (!isChannel) {
            const savetodatabaseEmbed = new client.g.discord.MessageEmbed()
                .setTitle('Scan channel — status (failure)')
                .setDescription(`I detect no any channel ID or link.`)
                .setColor(client.g.config.embedColor);
            return interaction.reply({ embeds: [savetodatabaseEmbed] });
        }
        let amImOnServer = await client.guilds.cache.get(isChannel.guild.id) !== undefined;
        if (!amImOnServer) {
            const savetodatabaseEmbed = new client.g.discord.MessageEmbed()
                .setTitle('Scan channel — status (failure)')
                .setDescription(`I detect channel, but I'm not on the server. Invite me first and retry.`)
                .setColor(client.g.config.embedColor);
            return interaction.reply({ embeds: [savetodatabaseEmbed] });
        }
        if (!isChannel.viewable) {
            const savetodatabaseEmbed = new client.g.discord.MessageEmbed()
                .setTitle('Scan channel — status (failure)')
                .setDescription(`I detect channel and I'm on the server, but I can not read it. Give me permissions and retry.`)
                .setColor(client.g.config.embedColor);
            return interaction.reply({ embeds: [savetodatabaseEmbed] });
        }
        if (!(isChannel.isText() || isChannel.isThread())) {
            const savetodatabaseEmbed = new client.g.discord.MessageEmbed()
                .setTitle('Scan channel — status (failure)')
                .setDescription(`I detect channel, I'm on the server, but I can read only text and tread channels. Give me another ID.`)
                .setColor(client.g.config.embedColor);
            return interaction.reply({ embeds: [savetodatabaseEmbed] });
        }

        let fetchMessages = await isChannel.messages.fetch()
            .then((d) => {return d})
            .catch(() => {return false});

        //await _isInvite(client, fetchMessages);
        let messagesContens = fetchMessages.map((i) => {return i.content});
        let messagesURLs = fetchMessages.map((i) => {return i.url});
        if (messagesContens.length == 0) console.log("No messages.");
        let arr = [];
        //console.log("map");
        for (let i = 0; i < messagesContens.length; i++) {
            let content = messagesContens[i]
                .replace('\n', ' ')
                .split(' ');
            //console.log("split");
            /* if (!(content.includes("discord") && (content.includes(".gg") || content.includes(".com"))))
                continue; */
            //console.log("possible invite");
            for (let ii = 0; ii < content.length; ii++) {
                //console.log("fetchInvite 2");
                /* let isInvite = await client.fetchInvite(content[ii])
                    .then(() => {return true})
                    .catch(() => {return false}); */
                if (content[ii].includes("discord.gg/") || content[ii].includes("discord.com/invite/")) {
                    let processing = content[ii].replace('//', '/').split('/');
                    let processing2 = content[ii].replace('https', 'http').replace('.com/invite/', '.gg/');dw
                    if (processing.length >= 3 && processing.length <= 4) {
                        console.log(messagesURLs[i] + ":", processing2, processing[processing.length - 1], "(" + ii + "/" + content.length + ")");
                        arr.push([messagesURLs[i], processing2]); //content[ii].split('/')[content[ii].length - 1]);
                    }
                }
            }
        }

        let _desc = "";
        for (let i = 0; i < arr.length; i++) {
            _desc += `([M](${arr[i][0]})) ${arr[i][1]}\n`;
        }
        let savetodatabaseEmbed = new client.g.discord.MessageEmbed()
            .setTitle(`Scan channel — status (${fetchMessages ? "success" : "failure"})`)
            .setDescription(_desc)
            .setFooter({ text: `Warning: Links above detected only by search pattern and not fetched for now. There may be mistakes or some links may not be listed.` })
            .setColor(client.g.config.embedColor);
        /* for (let i = 0; i < arr.length; i++) {
            savetodatabaseEmbed.addField('Invite №' + (i + 1) + '/' + arr.length, `${arr[i]}`);
        } */
        return interaction.reply({ embeds: [savetodatabaseEmbed] });
    },
};
