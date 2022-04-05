// Example of how to make a SlashCommand

module.exports = {
    name: "getinfo",
    usage: '/getinfo <invite link>',
    options: [
        {
            name: 'link',
            description: 'Invite link you want to me to lookup',
            type: 'STRING',
            required: true
        }
    ],
    category: "Utility",
    description: "I will try to get information about your invite link.",
    ownerOnly: false,
    run: async (client, interaction) => {
        const commandInt = interaction.options.getString("link");
        if (!commandInt) {
            interaction.reply({ content: `There isn't any invite link!"` });
            return 1;
        } else {
            /* try {
                const fetchedInvite = await client.fetchInvite(commandInt) //('https://discord.gg/djs')
            } catch (e) {
                if (e.reason == 'Unknown Invite' || !e.ok) { //e.httpStatus == '404') {
                    interaction.reply({ content: `Invite link is unknown! (was killed or not created yet)` });
                } else {
                    throw e;
                }
            } */
            const fetchedInvite = await client.fetchInvite(commandInt) //('https://discord.gg/djs')
            console.log(`Obtained invite with code: ${fetchedInvite.code}`);
            console.log(fetchedInvite.ok);
            const pingEmbed = new client.discord.MessageEmbed()
                .setTitle(':chains: Invite link info')
                .addField("Invite code", `${fetchedInvite.code}`, true)
                .setColor(client.config.embedColor)
                .setFooter({ text: `${client.config.embedfooterText}`, iconURL: `${client.user.displayAvatarURL()}` });

            await interaction.reply({ embeds: [pingEmbed] });
        }
    },
};
