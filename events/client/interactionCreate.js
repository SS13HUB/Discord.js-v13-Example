
const chalkMy = require(process.cwd() + "/src/chalk");

module.exports = {
    name: 'interactionCreate',

    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        //if (!interaction) return; // for fix "Invalid interaction application command" error
        if (!interaction.isCommand() && !interaction.isButton()) {
            return;
        } else if (interaction.isCommand()) {

            const command = client.slash.get(interaction.commandName);
            if (!command) return interaction.reply({ content: 'Error occured, check console.' });
            
            if (command.ownerOnly) {
                if (interaction.user.id !== process.env.OWNER_ID) {
                    return interaction.reply({ content: "This command only for Bot Owner!", ephemeral: true });
                }
            }
            
            const args = [];
            
            for (let option of interaction.options.data) {
                if (option.type === 'SUB_COMMAND') {
                    if (option.name) args.push(option.name);
                    option.options?.forEach(x => {
                        if (x.value) args.push(x.value);
                    });
                } else if (option.value) args.push(option.value);
            }
            
            let _where;
            if (interaction.guildId) {
                _where = interaction.guildId;
            } else {
                if (interaction.user.id != process.env.OWNER_ID) console.log("[Interaction]", interaction);
                _where = interaction.type;
            }
            console.log(chalkMy.cmd, `Command: "${command.name}" (user "${interaction.user.id}" in "${_where}")`);
            try {
                return command.run(client, interaction, args);
            } catch (e) {
                interaction.reply({ content: e.message });
            }
            
        } else if (interaction.isButton()) {
            //console.log(interaction);
            let triggerFounded = false;
            const cmdsArr = [...client.slash.keys()];
            for (let i = 0; i < cmdsArr.length; i++) {
                const element = client.slash.get(cmdsArr[i]);
                //console.log(element);
                if (!element.triggers) continue;
                if (element.triggers.includes(interaction.customId)) {
                    triggerFounded = true;
                    const command = element; //client.slash.get("one-time-button");
                    try {
                        return command.trigger(client, interaction); //, args
                    } catch (e) {
                        interaction.reply({ content: e.message });
                    }
                }
            }
            if (!triggerFounded) {
                await client.users.cache.get(process.env.OWNER_ID).send(`**Warning**: User ${interaction.user.id} tries send me in ${interaction.guildId} button with unknown ID: \`${interaction.customId}\`.`);
                await interaction.update({ components: [] }); // Message.removeAttachments
                return await interaction.followUp({ ephemeral: true, content: `**Error**: There is no any buttons with this ID: \`${interaction.customId}\`.` });
            }
            // if (modal.customId === 'modal-customid') {
            return; // interaction.channel.send({ content: "Button received.", ephemeral: true });
        }
    }
}
