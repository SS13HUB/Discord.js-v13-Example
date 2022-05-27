
const { inlineCode, codeBlock } = require('@discordjs/builders');
const { Formatters } = require('discord.js');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { Pool } = require('pg');
const connectionString = process.env.DB_URL;
const fs = require('fs').promises;

const chalkMy = require(process.cwd() + "/src/chalk");

const _local_debug = Boolean(0);

function doRequest(sql) {
    const pool = new Pool({
        connectionString,
        ssl: {
            rejectUnauthorized: false,
        },
    });
    return new Promise((resolve, reject) => {
        /* pool.query(
            sql.file(_path)._items[0].text, (err, res, fields) => {
            if (err) {console.error(err); process.exitCode = 1; return reject(err);} // throw err;
            if (res) resolve("OK?"); //console.log("OK?\n", res);
            //console.log(results[0].solution);
        }); */
        pool.query(sql, (err, res) => {
            //console.log(err ? err.stack : res.rows[0].message)
            if (err) {console.error(err); process.exitCode = 1; return reject(err);} // throw err;
            if (res) {resolve(res);} // "Query OK. Record successfully saved or updated." //resolve(res); //console.log("OK?\n", res);
        });
    });
}

const base_path = process.cwd() + '\\src\\database\\';
const db_invites_create = base_path + 'Invites\\create.sql';
const db_invites_drop   = base_path + 'Invites\\drop.sql';
const db_invites_insert = base_path + 'Invites\\insert.sql';
const db_invites_select = base_path + 'Invites\\select.sql';


let FilesSQLtoRead2 = {
    "_isLoaded": false,
    "Guilds": {
        "Create": db_invites_create,
        "Drop":   db_invites_drop,
        "Insert": db_invites_insert,
        "Select": db_invites_select
    },
    "Invites": {
        "Create": db_invites_create,
        "Drop":   db_invites_drop,
        "Insert": db_invites_insert,
        "Select": db_invites_select
    },
};

//let FilesSQLtoRead = [db_invites_create, db_invites_drop, db_invites_insert, db_invites_select];
let FilesSQLtoRead = [db_invites_select];
let isSQLloaded = false;

async function FilsqSQLtoCode(_FilesSQLtoRead) {
    if (!isSQLloaded) {
        if (_local_debug) console.log("Reading SQL in first time. (length: " + _FilesSQLtoRead.length + ")");
        for (let i = 0; i < _FilesSQLtoRead.length; i++) {
            let element = _FilesSQLtoRead[i];
            //if (_local_debug) console.log("[" + i + "/" + _FilesSQLtoRead.length + "]", element, "\n^", _FilesSQLtoRead[i]);
            _FilesSQLtoRead[i] = await fs.readFile(element, 'utf8');
            //_FilesSQLtoRead[i] = Buffer.from(data); // const data = 
            /* fs.readFile(element, 'utf8', (error, data) => {
                if (error) throw error;
                //console.log(data.toString());
                _FilesSQLtoRead[i] = data.toString();
                if (_local_debug) console.log("data:", data);
                if (_local_debug) console.log("data.toString():", data.toString());
            }); */
            if (_local_debug) console.log("[" + i + "/" + _FilesSQLtoRead.length + "]", element, "\n^", _FilesSQLtoRead[i]);
        }
        isSQLloaded = true;
    } else {
        if (_local_debug) console.log("SQL already readed.");
    }
    // _FilesSQLtoRead[0].includes(:\)
    return _FilesSQLtoRead;
};


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
            if (interaction.channel) {
                await interaction.channel.sendTyping();
            } else {
                try {
                    let _channel = await interaction.channels.fetch(interaction.channelId);
                    await _channel.sendTyping();
                } catch (e) {
                    // console.log("client:", client);
                    // console.log("modal:", modal); // ModalSubmitInteraction
                    // console.log("interaction:", interaction); // client
                    console.error(chalkMy.exct, e);
                }
            }
            const firstResponse = modal.getTextInputValue('textinput-customid');
            if (!firstResponse) return modal.reply({ content: `Error: There is not enough variables, cancel command execution.` });
            const secondResponse = modal.getTextInputValue('textinput-customid-2');
            if (!firstResponse) return modal.reply({ content: `Error: There is not enough variables, cancel command execution.` });
            //client.channels.cache.get(process.env.MASTER_LOG).send({ content: `modalSubmit event fired`});
            return modal.reply('Congrats! Powered by discord-modals.' + Formatters.codeBlock('markdown', firstResponse) + Formatters.codeBlock('markdown', secondResponse));
        } else if (modal.customId === 'submit-modal-form') {
            const inviteIn = modal.getTextInputValue('textinput-invite');
            if (!inviteIn) return modal.reply({ content: `Error: There is not enough variables, cancel command execution.` });
            const alive = "Unknown" || modal.getTextInputValue('textinput-alive');
            //if (!alive) alive = "Unknown"; //return modal.reply({ content: `Error: There is not enough variables, cancel command execution.` });
            const language =  "Unknown" || modal.getTextInputValue('textinput-language');
            //if (!language) language = "Unknown"; //return modal.reply({ content: `Error: There is not enough variables, cancel command execution.` });

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
                // Formatters.codeBlock('markdown', inviteIn) + Formatters.codeBlock('markdown', alive) + Formatters.codeBlock('markdown', language)
                return modal.reply({ ephemeral: true, content: `**Error**: There is no any alive invite link: \`${inviteIn}\`.` });
            }
            FilesSQLtoRead = await FilsqSQLtoCode(FilesSQLtoRead)
                .then((d) => {return d})
                .catch((error) => {console.error("Error: Cann't read SQL schema files:\n", FilesSQLtoRead, "\n", error); return FilesSQLtoRead});
            //const msg = (_local_debug ? await interaction.channel.send(`Provided input is alive invite. Saving to DB...`) : false);
            let request = FilesSQLtoRead[0]
                .replace('-- WHERE', 'WHERE')
                .replace("code = '__REPLACE_ME__'", `code = '${isInvite}'`);
            //if (_local_debug) console.log("request:", request);
            let isSaved = await doRequest(request)
                .then((val) => {return [true, val];})
                .catch((err) => {return [false, err];});
            //console.log("SQL:", isSaved[1]);
            console.log("rowCount:", isSaved[1].rowCount);
            console.log("rows:", isSaved[1].rows);

            // INSERTING BELOW
            console.log("modal:", modal);
            //console.log("interaction:", interaction);
            //console.log("client:", client);
            console.log("isInvite:", isInvite);
            const invite_code = isInvite.code;
            const invite_url = isInvite.url;
            let isThisInviteAlreadyMemorized = new Boolean(!isSaved[1].rowCount > 0);
            console.log("isThisInviteAlreadyMemorized:", isThisInviteAlreadyMemorized);
            if (!isThisInviteAlreadyMemorized) {
                FilesSQLtoRead = [db_invites_insert];
                isSQLloaded = false;
                FilesSQLtoRead = await FilsqSQLtoCode(FilesSQLtoRead)
                    .then((d) => {return d})
                    .catch((error) => {console.error("Error: Cann't read SQL schema files:\n", FilesSQLtoRead, "\n", error); return FilesSQLtoRead});
                //const msg = (_local_debug ? await interaction.channel.send(`Provided input is alive invite. Saving to DB...`) : false);
                //const now = new Date();
                // console.log("date:", new Date(), "now:", now);
                // THIS ----> console.log("toISOString:", new Date().toISOString() + "+00", "now:", now.toISOString() + "+00");
                // console.log("toLocaleDateString:", new Date().toLocaleDateString('us'), "now:", now.toLocaleDateString('us'));
                // console.log("toLocaleDateString2:", new Date().toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }), "now:", now.toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }));
                let request = FilesSQLtoRead[0]
                    .replace('code,', 'code, guild_id, discoverer_id,')
                    .replace("'__REPLACE_ME__',", `'${isInvite.code}', ${isInvite.guild.id}, ${modal.user.id},`);
                if (_local_debug) console.log("request:", request);
                let isSaved2 = await doRequest(request)
                    .then((val) => {return [true, val];})
                    .catch((err) => {return [false, err];});
                console.log("isSaved2:", isSaved2);
            }
            // INSERTING UPPER

            const row = new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId('submit-modal-form-post') // submit-modal-form-echo
                    .setLabel('Post')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setLabel(isInvite.code)
                    .setURL(isInvite.url) // ?with_counts=true&with_expiration=true
                    .setStyle('LINK'),
                new MessageButton()
                    .setCustomId('submit-modal-form-check') // submit-modal-form-echo
                    .setLabel('Check')
                    .setStyle('SECONDARY'),
                );
            const embed = new MessageEmbed()
                .setTitle(':chains: ・ Invite link submitting')
                .addField("Invite", `${isInvite.code}`, true)
                .addField("Is alive?", `${alive == "+" ? true : alive == "-" ? false : "Unknown"}`, true)
                .addField("Language", `${language}`, true)
                .addField("Inviter:", `${interaction.user.id}`)
                .addField("Is Already Memorized:", (((isSaved[0] != true) || (isSaved[1].rowCount !== undefined)) ? (isThisInviteAlreadyMemorized ? "Yes" : "No, saved") : "Query error"))
                //.addField("Database:", '>', isSaved[1])
                //.addField("rowCount:", '>', isSaved[1].rowCount)
                //.addField("rows:", '>', isSaved[1].rows) // "```\n"
                //.setColor(client.config.embedColor)
                .setTimestamp()
                .setFooter({ text: `You: ${modal.user.id}; Server: ${isInvite.guild.id}`, iconURL: `${modal.user.displayAvatarURL()}` }); //isInvite.guild.iconURL()
            return modal.reply({ content: isInvite.url, embeds: [embed], components: [row] });
            /* return modal.reply(
                'Congrats! Powered by discord-modals.' + 
                Formatters.codeBlock('markdown', isInvite) + 
                Formatters.codeBlock('markdown', alive) + 
                Formatters.codeBlock('markdown', language)
            ); */
        } else {
            await modal.reply({ ephemeral: true, content: `**Error**: There is no any modals with this ID: \`${modal.customId}\`.` });
            return await interaction.update({ components: [] }); // Message.removeAttachments
            // return interaction.update({ content: 'Error occured, please check console.', components: [], embeds: [] });
        }
    }
}
