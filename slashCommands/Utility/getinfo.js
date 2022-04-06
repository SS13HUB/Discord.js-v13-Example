
async function _fetchInvite(invite) {
    try {
        const fetchedInvite = await client.fetchInvite(invite);
        return fetchedInvite;
    } catch (e) {
        return false;
    }
}

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
        if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ content: `You can only add servers with ADMINISTRATOR authorization.` });
        const commandInt = interaction.options.getString("link");
        if (!commandInt) {
            return interaction.reply({ content: `There isn't any invite link!` });
        }
        /* try {
            await client.fetchInvite(args);
        } catch (err) {
            return interaction.reply({ content: `Invite link is unknown! (was killed or not created yet)` });
        } */
        /* try {
            const fetchedInvite = await client.fetchInvite(commandInt) //('https://discord.gg/djs')
        } catch (e) {
            if (e.reason == 'Unknown Invite' || !e.ok) { //e.httpStatus == '404') {
                interaction.reply({ content: `Invite link is unknown! (was killed or not created yet)` });
            } else {
                throw e;
            }
        } */
        
        const fetchedInvite = await _fetchInvite(commandInt); //('https://discord.gg/djs')
        if (fetchedInvite === false) {
            return interaction.reply({ content: `Invite link is unknown! (was killed or not created yet)` });
        }
        console.log(`Obtained invite with code: ${fetchedInvite.code}`);
        console.log(fetchedInvite.ok);
        const pingEmbed = new client.discord.MessageEmbed()
            .setTitle(':chains: Invite link info')
            .addField("Invite code", `${fetchedInvite.code}`, true)
            .setColor(client.config.embedColor)
            .setFooter({ text: `${client.config.embedfooterText}`, iconURL: `${client.user.displayAvatarURL()}` });

        await interaction.reply({ embeds: [pingEmbed] });
        
    },
};
