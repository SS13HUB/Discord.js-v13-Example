const { readdirSync } = require("fs");

// Example of how to make a Help SlashCommand

module.exports = {
    name: "help",
    usage: '/help <command>',
    options: [
        {
            name: 'command',
            description: 'What command do you need help',
            type: 'STRING',
            required: false
        }
    ],
    category: "Bot",
    description: "Return all commands, or one specific command!",
    adminOnly: false,
    ownerOnly: false,
    doNotRegisterSlash: false,
    run: async (client, interaction) => {
        console.log(interaction);
        if (interaction.channel) {
            await interaction.channel.sendTyping();
        } else {
            let _channel = await client.channels.fetch(interaction.channelId);
            await _channel.sendTyping();
        }

        // Buttons that take you to a link
        // If you want to delete them, remove this part of
        // the code and in line: 62 delete ", components: [row]"
        const row = new client.g.discord.MessageActionRow()
            .addComponents(
                new client.g.discord.MessageButton()
                    .setLabel("GitHub")
                    .setStyle("LINK")
                    .setURL("https://github.com/Expectatives/Discord.js-v13-Example"),
                new client.g.discord.MessageButton()
                    .setLabel("Support")
                    .setStyle("LINK")
                    .setURL("https://dsc.gg/faithcommunity")
            );

        const commandInt = interaction.options.getString("command");
        if (!commandInt) {

            // Get the slash commands of a Bot category
            const botCommandsList = [];
            readdirSync(client.g.cwd + '\\src\\commands\\slash\\Bot').forEach((file) => {
                const filen = require(client.g.cwd + '\\src\\commands\\slash\\Bot\\' + file);
                const name = `\`${filen.name}\``
                botCommandsList.push(name);
            });

            // Get the slash commands of a Utility category
            const utilityCommandsList = [];
            readdirSync(client.g.cwd + '\\src\\commands\\slash\\Utility').forEach((file) => {
                const filen = require(client.g.cwd + '\\src\\commands\\slash\\Utility\\' + file);
                const name = `\`${filen.name}\``
                utilityCommandsList.push(name);
            });

            // This is what it commands when using the command without arguments
            const helpEmbed = new client.g.discord.MessageEmbed()
                .setTitle(`${client.user.username} SlashHelp`)
                .setDescription(` Hello **<@${interaction.user.id}>**, I am <@${client.user.id}>.  \nYou can use \`/help <slash_command>\` to see more info about the SlashCommands!\n**Total Commands:** ${client.g.cmds.legacy.size}\n**Total SlashCommands:** ${client.g.cmds.slash.size}`)
                .addField("🤖 - Bot SlashCommands", botCommandsList.map((data) => `${data}`).join(", "), true)
                .addField("🛠 - Utility SlashCommands", utilityCommandsList.map((data) => `${data}`).join(", "), true)
                .setColor(client.g.config.embedColor)
                .setFooter({ text: `${client.g.config.embedfooterText}`, iconURL: `${client.user.displayAvatarURL()}` });

            interaction.reply({ embeds: [helpEmbed], components: [row] });
        } else {
            const command = client.g.cmds.slash.get(commandInt.toLowerCase());

            // This is what it sends when using the command with argument and it does not find the command
            if (!command) {
                interaction.reply({ content: `There is no any SlashCommand named "${commandInt}"` });
            } else {

                // This is what it sends when using the command with argument and if it finds the command
                let command = client.g.cmds.slash.get(commandInt.toLowerCase());
                let name = command.name;
                let description = command.description || "No descrpition provided"
                let usage = command.usage || "No usage provided"
                let category = command.category || "No category provided!"

                let helpCmdEmbed = new client.g.discord.MessageEmbed()
                    .setTitle(`${client.user.username} Help | \`${(name.toLocaleString())}\` SlashCommand`)
                    .addFields(
                        { name: "Description", value: `${description}` },
                        { name: "Usage", value: `${usage}` },
                        { name: 'Category', value: `${category}` })
                    .setColor(client.g.config.embedColor)
                    .setFooter({ text: `${client.g.config.embedfooterText}`, iconURL: `${client.user.displayAvatarURL()}` });

                interaction.reply({ embeds: [helpCmdEmbed] });
            }
        }
    },
};
