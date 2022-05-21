
const { Formatters } = require('discord.js');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const chalkMy = require(process.cwd() + "/src/chalk");

module.exports = {
    name: 'modalSubmit',

    /**
     * @param {Modal} modal
     * @param {Interaction} interaction
     * @param {Client} client
     */
    async execute(modal, interaction, client) {
        //let modal = interaction.fields[0];
        console.log(chalkMy.event, `Event fired: "modalSubmit".`);
        //console.log(modal);
        if (modal.customId === 'modal-customid') {
            await interaction.channel.sendTyping();
            const firstResponse = modal.getTextInputValue('textinput-customid');
            if (!firstResponse) return interaction.reply({ content: `Error: There is not enough variables, cancel command execution.` });
            const secondResponse = modal.getTextInputValue('textinput-customid-2');
            if (!firstResponse) return interaction.reply({ content: `Error: There is not enough variables, cancel command execution.` });
            //client.channels.cache.get(process.env.LOG_CHANNEL_ID).send({ content: `modalSubmit event fired`});
            return modal.reply('Congrats! Powered by discord-modals.' + Formatters.codeBlock('markdown', firstResponse) + Formatters.codeBlock('markdown', secondResponse));
        } else if (modal.customId === 'submit-modal-form') {
            const inviteIn = modal.getTextInputValue('textinput-invite');
            if (!inviteIn) return interaction.reply({ content: `Error: There is not enough variables, cancel command execution.` });
            const alive = modal.getTextInputValue('textinput-alive');
            if (!alive) return interaction.reply({ content: `Error: There is not enough variables, cancel command execution.` });
            const language = modal.getTextInputValue('textinput-language');
            if (!language) return interaction.reply({ content: `Error: There is not enough variables, cancel command execution.` });

            // TypeError: Cannot read properties of undefined (reading 'fetchInvite')
            if (typeof inviteIn !== "string") inviteIn = `${inviteIn}`;
            //console.log(client, user, this.client, this.user, interaction.client, interaction.user, modal.user, modal.client);
            //console.log("1 interaction.client", interaction.client);
            //console.log("2 interaction.user", interaction.user);
            //console.log("3 modal.user", modal.user);
            //console.log("4 modal.client", modal.client);
            //console.log("5 modal.user", modal.user);
            let isInvite = await modal.client.fetchInvite(inviteIn)
                .then((d) => {return d})
                .catch(() => {return false});
            if (!isInvite) {
                return interaction.reply({ ephemeral: true, content: `Error: There is no any alive invite link.` + Formatters.codeBlock('markdown', inviteIn) + Formatters.codeBlock('markdown', alive) + Formatters.codeBlock('markdown', language) });
            }
            const row = new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId('submit-modal-form-echo')
                    .setLabel('Echo')
                    .setStyle('PRIMARY'),
                );
            const embed = new MessageEmbed()
                .setTitle(':chains: ・ Invite link info')
                .addField("Invite", `${inviteIn}`, true) // inviteIn.code
                .addField("Is alive?", `${alive == "+" ? true : alive == "-" ? false : "unknown input"}`, true)
                .addField("Language", `${language}`, true)
                //.setColor(client.config.embedColor)
                .setTimestamp()
                .setFooter({ text: `ID: ${isInvite.guild.id}`, iconURL: `${isInvite.guild.iconURL()}` });
            return modal.reply({ embeds: [embed], components: [row] });
            /* return modal.reply(
                'Congrats! Powered by discord-modals.' + 
                Formatters.codeBlock('markdown', inviteIn) + 
                Formatters.codeBlock('markdown', alive) + 
                Formatters.codeBlock('markdown', language)
            ); */
        }
    }
}
