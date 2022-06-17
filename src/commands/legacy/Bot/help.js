const { readdirSync } = require("fs");

// Example of how to make a Help Command

module.exports = {
    name: "help",
    aliases: ["h", "commands"],
    usage: '!help <command>',
    category: "Bot",
    description: "Return all commands, or one specific command!",
    adminOnly: false,
    ownerOnly: false,
    run: async (client, message, args) => {

        // Buttons that take you to a link
        // If you want to delete them, remove this part of
        // the code and in line: 55 delete ", components: [row]"
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

        if (!args[0]) {

            // Get the commands of a Bot category
            const botCommandsList = [];
            readdirSync(client.g.cwd + '\\src\\commands\\legacy\\Bot').forEach((file) => {
                const filen = require(client.g.cwd + '\\src\\commands\\legacy\\Bot\\' + file);
                const name = `\`${filen.name}\``
                botCommandsList.push(name);
            });

            // Get the commands of a Utility category
            const utilityCommandsList = [];
            readdirSync(client.g.cwd + '\\src\\commands\\legacy\\Utility').forEach((file) => {
                const filen = require(client.g.cwd + '\\src\\commands\\legacy\\Utility\\' + file);
                const name = `\`${filen.name}\``
                utilityCommandsList.push(name);
            });

            // This is what it commands when using the command without arguments
            const helpEmbed = new client.g.discord.MessageEmbed()
                .setTitle(`${client.user.username} Help`)
                .setDescription(` Hello **<@${message.author.id}>**, I am <@${client.user.id}>.  \nYou can use \`!help <command>\` to see more info about the commands!\n**Total Commands:** ${client.g.cmds.legacy.size}\n**Total SlashCommands:** ${client.g.cmds.slash.size}`)
                .addField("🤖 - Bot Commands", botCommandsList.map((data) => `${data}`).join(", "), true)
                .addField("🛠 - Utility Commands", utilityCommandsList.map((data) => `${data}`).join(", "), true)
                .setColor(client.g.config.embedColor)
                .setFooter({ text: `${client.g.config.embedfooterText}`, iconURL: `${client.user.displayAvatarURL()}` });

            message.reply({ embeds: [helpEmbed], allowedMentions: { repliedUser: false }, components: [row] });
        } else {
            const command = client.g.cmds.legacy.get(args[0].toLowerCase()) || client.g.cmds.legacy.find((c) => c.aliases && c.aliases.includes(args[0].toLowerCase()));

            // This is what it sends when using the command with argument and it does not find the command
            if (!command) {
                message.reply({ content: `There is no any command named "${args[0]}"`, allowedMentions: { repliedUser: false } });
            } else {

                // This is what it sends when using the command with argument and if it finds the command
                let command = client.g.cmds.legacy.get(args[0].toLowerCase()) || client.g.cmds.legacy.find((c) => c.aliases && c.aliases.includes(args[0].toLowerCase()));
                let name = command.name;
                let description = command.description || "No descrpition provided"
                let usage = command.usage || "No usage provided"
                let aliases = command.aliases || "No aliases provided"
                let category = command.category || "No category provided!"

                let helpCmdEmbed = new client.g.discord.MessageEmbed()
                    .setTitle(`${client.user.username} Help | \`${(name.toLocaleString())}\` Command`)
                    .addFields(
                        { name: "Description", value: `${description}` },
                        { name: "Usage", value: `${usage}` },
                        { name: "Aliases", value: `${aliases}` },
                        { name: 'Category', value: `${category}` })
                    .setColor(client.g.config.embedColor)
                    .setFooter({ text: `${client.g.config.embedfooterText}`, iconURL: `${client.user.displayAvatarURL()}` });

                message.reply({ embeds: [helpCmdEmbed], allowedMentions: { repliedUser: false } });
            }
        }
    },
};
