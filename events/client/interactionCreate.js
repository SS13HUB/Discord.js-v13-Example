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
            
            try {
                return command.run(client, interaction, args);
            } catch (e) {
                interaction.reply({ content: e.message });
            }
            
        } else if (interaction.isButton()) {
            if (interaction.customId == "one-time-button") {
                const command = client.slash.get("one-time-button");
                try {
                    return command.trigger(client, interaction); //, args
                } catch (e) {
                    interaction.reply({ content: e.message });
                }
            }
            // if (modal.customId === 'modal-customid') {
            //console.log(interaction);
            return; // interaction.channel.send({ content: "Button received.", ephemeral: true });
        }
    }
}
