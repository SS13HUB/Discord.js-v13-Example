
const { Permissions, MessageActionRow, MessageButton } = require('discord.js');
const { Pool, Client } = require('pg');
const {sql} = require('@databases/pg');
const connectionString = process.env.DB_URL;
const fs = require('fs');

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
            if (res) {resolve("Query OK. Record successfully saved or updated.");} //resolve(res); //console.log("OK?\n", res);
        });
    });
}

const base_path = client.cwd + '\\src\\database\\';
const db_guilds_create = base_path + 'Guilds\\create.sql';
const db_guilds_drop   = base_path + 'Guilds\\drop.sql';
const db_guilds_insert = base_path + 'Guilds\\insert.sql';
const db_guilds_select = base_path + 'Guilds\\select.sql';


let FilesSQLtoRead2 = {
    "_isLoaded": false,
    "Guilds": {
        "Create": db_guilds_create,
        "Drop":   db_guilds_drop,
        "Insert": db_guilds_insert,
        "Select": db_guilds_select
    },
    "Invites": {
        "Create": db_guilds_create,
        "Drop":   db_guilds_drop,
        "Insert": db_guilds_insert,
        "Select": db_guilds_select
    },
};

let FilesSQLtoRead = [db_guilds_create, db_guilds_drop, db_guilds_insert, db_guilds_select];
let isSQLloaded = false;

async function FilsqSQLtoCode(_FilesSQLtoRead) {
    if (!isSQLloaded) {
        for (let i = 0; i < _FilesSQLtoRead.length; i++) {
            let element = _FilesSQLtoRead[i];
            fs.readFile(element, 'utf8', (error, data) => {
                if (error) throw error;
                //console.log(data.toString());
                _FilesSQLtoRead[i] = data.toString();
            });
        }
        isSQLloaded = true;
    }
    // _FilesSQLtoRead[0].includes(:\)
    return _FilesSQLtoRead;
};


module.exports = {
    name: "save-to-database",
    usage: '/save-to-database <invite link or ID>',
    category: "Utility",
    options: [
        {
            name: 'input',
            description: 'invite link or code or server ID.', // ToDo: .fetchWebhook(idtoken) AND channel ID
            type: 'STRING',
            required: true
        }
    ],
    description: "I will try to fetch it and save information in my database.",
    adminOnly: false,
    ownerOnly: false,
    run: async (client, interaction) => {
        if (interaction.channel) {
            await interaction.channel.sendTyping();
        } else {
            let _channel = await client.channels.fetch(interaction.channelId);
            await _channel.sendTyping();
        }
        const param1 = interaction.options.getString("input");
        if (!param1) return interaction.reply({ content: `There is no any invite link, channel ID or server ID!` });

        if (typeof param1 !== "string") param1 = `${param1}`;

        FilesSQLtoRead = await FilsqSQLtoCode(FilesSQLtoRead)
            .then((d) => {return d})
            .catch((error) => {console.error("Error: Cann't read SQL schema files:\n", FilesSQLtoRead, "\n", error); return FilesSQLtoRead});

        let isInvite = await client.fetchInvite(param1)
            .then((d) => {return d})
            .catch(() => {return false});

        /* let isChannel = await client.channels.fetch(param1)
            .then((d) => {return d})
            .catch(() => {return false}); */

        let isServer = await client.guilds.fetch(param1)
            .then((d) => {return d})
            .catch(() => {return false});

        console.log(client.chalk.cmd, `${interaction.user.id} trigger save-to-database: (${(param1 != null ? param1 : null)})`); //${(fetchedWidget !== undefined ? fetchedWidget.id : "widget unknown")}

        if (isInvite) {
            let savetodatabaseEmbed = new client.discord.MessageEmbed()
                .setTitle('Save to DB — status')
                .setDescription(`I detect invite. Saving to DB...`)
                .setColor(client.config.embedColor);
            //const msg = await interaction.reply({ embeds: [savetodatabaseEmbed] });
            let amImOnServer = await client.guilds.cache.get(isInvite.guild.id) !== undefined;
            if (amImOnServer) {
                const msg = (_local_debug ? await interaction.channel.send(`Provided input is alive invite. Saving to DB...`) : false);
                request = FilesSQLtoRead[2]
                    .replace('key, ',   'id, ' +               'name, ' +                'icon, ' +                'features, ' +                                                                    'splash, ' +                'banner, ' +                'description, ' +                'verification_level, ' +               'vanity_url_code, ' +              'nsfw_level, ' +               'welcome_screen, ' +               'invite_link, ')
                    .replace('value, ', `${isInvite.guild.id}, '${isInvite.guild.name}', '${isInvite.guild.icon}', '${JSON.stringify(isInvite.guild.features).replace('[', '{').replace(']', '}')}', '${isInvite.guild.splash}', '${isInvite.guild.banner}', '${isInvite.guild.description}', '${isInvite.guild.verificationLevel}', '${isInvite.guild.vanityURLCode}', '${isInvite.guild.nsfwLevel}', '${isInvite.guild.welcomeScreen}', '${isInvite.code}', `)
                    .replace('key = value', `id = '${isInvite.guild.id}', name = '${isInvite.guild.name}', icon = '${isInvite.guild.icon}', features = '${JSON.stringify(isInvite.guild.features).replace('[', '{').replace(']', '}')}', splash = '${isInvite.guild.splash}', banner = '${isInvite.guild.banner}', verification_level = '${isInvite.guild.verificationLevel}', vanity_url_code = '${isInvite.guild.vanityURLCode}', nsfw_level = '${isInvite.guild.nsfwLevel}', welcome_screen = '${isInvite.guild.welcomeScreen}', invite_link = '${isInvite.code}'`)
                    .replace('_id', `${isInvite.guild.id}`);
                if (_local_debug) console.log("request:", request);
                let isSaved = await doRequest(request)
                    .then((val) => {return [true, val];})
                    .catch((err) => {return [false, err];});
                console.log("SQL: " + isSaved[1]);
                if (_local_debug) {
                    msg.delete();
                }
                savetodatabaseEmbed = new client.discord.MessageEmbed()
                    .setTitle('Save to DB — status (' + (isSaved[0] ? "success" : "failure") + ')')
                    .setDescription('Alive invite detected and processed.\nSaved server id: ' + isInvite.guild.id + '\n```sql\n' + isSaved[1] + '```')
                    .setColor(client.config.embedColor);
                if (_local_debug) console.log("isInvite:", isInvite);
                return interaction.reply({ embeds: [savetodatabaseEmbed] });
            } else {
                const msg = (_local_debug ? await interaction.channel.send(`Provided input is alive invite. Warning: I'm not on target server, so information is limited. Saving to DB...`) : false);
                request = FilesSQLtoRead[2]
                    .replace('key, ',   'id, ' +               'name, ' +                'icon, ' +                'features, ' +                                                                    'splash, ' +                'banner, ' +                'description, ' +                'verification_level, ' +               'vanity_url_code, ' +              'nsfw_level, ' +               'welcome_screen, ' +               'invite_link, ')
                    .replace('value, ', `${isInvite.guild.id}, '${isInvite.guild.name}', '${isInvite.guild.icon}', '${JSON.stringify(isInvite.guild.features).replace('[', '{').replace(']', '}')}', '${isInvite.guild.splash}', '${isInvite.guild.banner}', '${isInvite.guild.description}', '${isInvite.guild.verificationLevel}', '${isInvite.guild.vanityURLCode}', '${isInvite.guild.nsfwLevel}', '${isInvite.guild.welcomeScreen}', '${isInvite.code}', `)
                    .replace('key = value', `id = '${isInvite.guild.id}', name = '${isInvite.guild.name}', icon = '${isInvite.guild.icon}', features = '${JSON.stringify(isInvite.guild.features).replace('[', '{').replace(']', '}')}', splash = '${isInvite.guild.splash}', banner = '${isInvite.guild.banner}', verification_level = '${isInvite.guild.verificationLevel}', vanity_url_code = '${isInvite.guild.vanityURLCode}', nsfw_level = '${isInvite.guild.nsfwLevel}', welcome_screen = '${isInvite.guild.welcomeScreen}', invite_link = '${isInvite.code}'`)
                    .replace('_id', `${isInvite.guild.id}`);
                if (_local_debug) console.log("request:", request);
                let isSaved = await doRequest(request)
                    .then((val) => {return [true, val];})
                    .catch((err) => {return [false, err];});
                console.log("SQL: " + isSaved[1]);
                if (_local_debug) {
                    msg.delete();
                }
                savetodatabaseEmbed = new client.discord.MessageEmbed()
                    .setTitle('Save to DB — status (' + (isSaved[0] ? "success" : "failure") + ')')
                    .setDescription('Alive invite detected and processed.\nSaved server id: ' + isInvite.guild.id + '\n```sql\n' + isSaved[1] + '```')
                    .setFooter({ text: `Warning: I'm not on target server, so saved information is limited. You can help me, if someone will invite me and repeat this command.` })
                    .setColor(client.config.embedColor);
                if (_local_debug) console.log("isInvite:", isInvite);
                return interaction.reply({ embeds: [savetodatabaseEmbed] });
            }
        // no way to search server → https://discord.js.org/#/docs/discord.js/stable/class/Channel
        // ToDO: or has way → https://discord.js.org/#/docs/discord.js/stable/class/TextChannel?scrollTo=guild
        /* } else if (isChannel) {
            const savetodatabaseEmbed = new client.discord.MessageEmbed()
                .setTitle('Save to DB')
                .setDescription(`I detect channel.`)
                .setColor(client.config.embedColor);
            return interaction.reply({ embeds: [savetodatabaseEmbed] }); */
        } else if (isServer) {
            const savetodatabaseEmbed = new client.discord.MessageEmbed()
                .setTitle('Save to DB')
                .setDescription(`I detect server.`)
                .setColor(client.config.embedColor);
            //return interaction.reply({ embeds: [savetodatabaseEmbed] });
            let amImOnServer = await client.guilds.cache.get(isServer.id) !== undefined;
        } else {
            const savetodatabaseEmbed = new client.discord.MessageEmbed()
                .setTitle('Save to DB')
                .setDescription(`I detect no invite or server ID.`)
                .setColor(client.config.embedColor);
            return interaction.reply({ embeds: [savetodatabaseEmbed] });
        }

        //console.debug(isInvite, isChannel, isServer);
        //console.log(fetchedWidget.channels.map((channel) => [channel.id, channel.name]));
        //console.log(fetchedWidget.channels.mapValues((channel) => [channel.id, channel.name]));
    },
};
