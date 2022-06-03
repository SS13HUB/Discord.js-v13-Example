
const { SlashCommandBuilder } = require('@discordjs/builders'); // require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');


const self = module.exports = {
    name: "create-invite",
    category: "Utility",
    description: "Creates an invite to this guild channel.",
    ownerOnly: false,
    /* options: [
        {
            name: 'channel',
            description: 'Channel URL or link.',
            type: 'STRING',
            required: false
        }
    ], */
    triggers: [
        'create-invite'
    ],
    trigger: async (client, interaction) => {
        if (interaction.customId == self.triggers[0]) {
            let oldInvites = await interaction.channel.fetchInvites()
                .then((val) => {return [true, val];})
                .catch((err) => {return [false, err];});
            if (!oldInvites[0]) {
                console.error(oldInvites[1]);
                return interaction.update({ content: 'Error occured, please check console.', components: [], embeds: [] });
            }
            if ([...oldInvites[1].keys()].length <= 0) {
                await interaction.update({ content: 'No old invites detected to this channel, generating new one.', components: [], embeds: [] });
                let invite = await interaction.channel.createInvite({
                    maxAge: 0,
                    reason: `Requested by ${interaction.member.displayName} (${interaction.member.id})`
                });
                console.log("new invite", invite);
                return interaction.update({ content: ''+invite, components: [], embeds: [] });
            } else {
                const invitesArr = [...oldInvites[1].keys()];
                const key = Math.floor(Math.random() * invitesArr.length);
                const element = oldInvites[1].get(invitesArr[key]).url;
                //console.log("key, invitesArr, element", key, invitesArr, element);
                return interaction.update({ content: element, components: [], embeds: [] });
            }
        }
    },
    run: async (client, interaction) => {
        if (interaction.channel) {
            await interaction.channel.sendTyping();
        } else {
            let _channel = await client.channels.fetch(interaction.channelId);
            await _channel.sendTyping();
        }
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId(self.triggers[0])
                .setLabel('Get new invite')
                .setStyle('PRIMARY'),
            );

        await interaction.reply({ content: 'Click below to create new (∞) invite to this channel.', components: [row] });
    },
};
