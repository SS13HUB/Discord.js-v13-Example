
async function _fetchInvite(client, invite) {
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
}

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
        const invite = interaction.options.getString("invite");
        if (!invite) {
            return interaction.reply({ content: `There isn't any invite link!` });
        }
        //const fetchedInvite = await _fetchInvite(client, invite); //('https://discord.gg/djs')
        //const fetchedInvite = await client.fetchInvite(invite);
        const fetchedInvite = await client.fetchInvite(invite)
            .then((data) => {return data;})
            //.catch(() => {return false;});
        if (fetchedInvite === null) {
            return interaction.reply({ content: `Error: ${fetchedInvite}` });
            //return interaction.reply({ content: `Invite link is unknown! (was killed or not created yet)` });
        }
        const embed = new client.discord.MessageEmbed()
            .setTitle(':chains: Invite link info')
            .addField('Invite Code', `${fetchedInvite.code}`, true)
            .addField('Server ID', `${fetchedInvite.guild.id}`, true)
            .addField('Server Name', `${fetchedInvite.guild.name}`, true)
            .addField('Server Member Count', `${fetchedInvite.presenceCount}`, true)
            .addField('Invite Uses', `${fetchedInvite.uses}`, true)
            .setColor(client.config.embedColor)
            .setFooter({ text: `${client.config.embedfooterText}`, iconURL: `${client.user.displayAvatarURL()}` });

        await interaction.reply({ embeds: [embed] });
        
    },
};
