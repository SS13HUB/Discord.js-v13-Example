
const _local_debug = Boolean(0);

module.exports = {
    name: 'interactionCreate',

    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        //if (!interaction) return; // for fix "Invalid interaction application command" error
        //console.log('interaction:', interaction);
        if (!interaction.isCommand() && !interaction.isButton() && !interaction.isContextMenu()
        ) {
            return;
        } else if (interaction.isCommand()) {

            const command = client.g.cmds.slash.get(interaction.commandName);
            if (!command) return await interaction.reply({ content: 'Error occured, check console.' });
            
            if (command.ownerOnly) {
                if (interaction.user.id !== process.env.OWNER_ID) {
                    return await interaction.reply({ content: "This command only for Bot Owner!", ephemeral: true });
                }
            }
            if (command.adminOnly) {
                if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
                    await client.users.cache.get(process.env.OWNER_ID).send(`**Warning**: User ${interaction.user.id} tries send me in ${interaction.guildId ? interaction.guildId : 'DM'} command without rights:\n\`${command}\`.`);
                    return await interaction.reply({ ephemeral: true, content: `This command only for users with ADMINISTRATOR authorization.` });
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
            console.log(client.g.chalk.cmd, `Command: "${command.name}" (user "${interaction.user.id}" in "${_where}")`);
            try {
                if (interaction.channel) {
                    await interaction.channel.sendTyping();
                } else {
                    let _channel = await client.channels.fetch(interaction.channelId);
                    await _channel.sendTyping();
                }
            } catch (e) {
                console.log('Can\'t send typing:', e);
            }
            try {
                return command.run(client, interaction, args);
            } catch (e) {
                return await interaction.reply({ content: e.message });
            }

        } else if (interaction.isButton()) {
            //console.log(interaction); //MessageContextMenuInteraction
            let triggerFounded = false;
            const cmdsArr = [...client.g.cmds.slash.keys()];
            if (_local_debug) console.log('Button hit, interaction.customId:', interaction.customId);
            for (let i = 0; i < cmdsArr.length; i++) {
                const element = client.g.cmds.slash.get(cmdsArr[i]);
                //console.log(element);
                if (!element.triggers) continue;
                if (_local_debug) console.log(`element: ${element.name}, trigger: ${element.triggers}`);
                if (element.triggers.includes(interaction.customId)) {
                    if (_local_debug) console.log(`hit`);
                    console.log(client.g.chalk.event, `InteractionButton triggered: "${element.name}", "${interaction.customId}", by "${interaction.user.id}", under "${interaction.message.id}".`);
                    triggerFounded = true;
                    const command = element; //client.g.cmds.slash.get("one-time-button");
                    try {
                        return command.trigger(client, interaction); //, args
                    } catch (e) {
                        return await interaction.reply({ content: e.message });
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

        } else if (interaction.isContextMenu()) {
            //console.log('isContextMenuCommand:', interaction.isContextMenuCommand()); // undefined
            const command = client.g.cmds.slash.get(interaction.commandName);
            if (!command) return await interaction.reply({ content: 'Error occured, check console.' });
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
            if (command.ownerOnly) {
                if (interaction.user.id !== process.env.OWNER_ID) {
                    return await interaction.reply({ content: "This command only for Bot Owner!", ephemeral: true });
                }
            }
            if (command.adminOnly) {
                if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
                    await client.users.cache.get(process.env.OWNER_ID).send(`**Warning**: User ${interaction.user.id} tries send me in ${interaction.guildId ? interaction.guildId : 'DM'} command without rights:\n\`${command}\`.`);
                    return await interaction.reply({ ephemeral: true, content: `This command only for users with ADMINISTRATOR authorization.` });
                }
            }
            console.log(client.g.chalk.cmd, `ContextMenu: "${command.name}" (user "${interaction.user.id}" in "${_where}")`);
            try {
                if (interaction.channel) {
                    await interaction.channel.sendTyping();
                } else {
                    let _channel = await client.channels.fetch(interaction.channelId);
                    await _channel.sendTyping();
                }
            } catch (e) {
                console.log('Can\'t send typing:', e);
            }
            try {
                return command.run(client, interaction, args);
            } catch (e) {
                return await interaction.reply({ content: e.message });
            }
        }
    }
}
