
const { Permissions, MessageActionRow, MessageButton } = require('discord.js');
const { Pool, Client } = require('pg');
const {sql} = require('@databases/pg');
const connectionString = process.env.DB_URL;
const fs = require('fs');

function doRequest(pool, sql) {
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
            if (res) resolve("OK?"); //console.log("OK?\n", res);
        });
    });
}

const base_path = process.cwd() + '/src/database/Guilds/';
let db_guilds_create = base_path + 'create.sql';
let db_guilds_drop   = base_path + 'drop.sql';
let db_guilds_insert = base_path + 'insert.sql';
let db_guilds_select = base_path + 'select.sql';

fs.readFile(db_guilds_insert, 'utf8', (error, data) => {
    if (error) throw error;
    console.log(data.toString());
    db_guilds_insert = data.toString();
});

module.exports = {
    name: "savetodatabase",
    usage: '/savetodatabase <invite link or ID>',
    category: "Utility",
    options: [
        {
            name: 'input',
            description: 'invite link or code, channel ID or server ID.', // ToDo: .fetchWebhook(idtoken)
            type: 'STRING',
            required: true
        }
    ],
    description: "I will try to fetch it and save information in my database.",
    ownerOnly: true,
    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply({ content: `You can only add servers with ADMINISTRATOR authorization.` });
        const param1 = interaction.options.getString("input");
        if (!param1) return interaction.reply({ content: `There isn't any invite link, channel ID or server ID!` });

        if (typeof param1 !== "string") para1 = `${param1}`;

        const pool = new Pool({
            connectionString,
            ssl: {
                rejectUnauthorized: false,
            },
        });

        let isInvite = await client.fetchInvite(param1)
            .then((d) => {return d})
            .catch(() => {return false});

        /* let isChannel = await client.channels.fetch(param1)
            .then((d) => {return d})
            .catch(() => {return false}); */

        let isServer = await client.guilds.fetch(param1)
            .then((d) => {return d})
            .catch(() => {return false});

        console.log(`[CMD] ${interaction.user.id} trigger savetodatabase: (${(param1 != null ? param1 : null)})`); //${(fetchedWidget !== undefined ? fetchedWidget.id : "widget unknown")}

        if (isInvite) {
            let savetodatabaseEmbed = new client.discord.MessageEmbed()
                .setTitle('Save to DB')
                .setDescription(`I detect invite. Saving to DB...`)
                .setColor(client.config.embedColor);
            //const msg = await interaction.reply({ embeds: [savetodatabaseEmbed] });
            const msg = await interaction.channel.send(`I detect invite. Saving to DB...`);
            request = db_guilds_insert.replace('value', `'${isInvite.guild.id}', '${isInvite.guild.name}', '${isInvite.guild.icon}', '${new Date().toISOString()}', '${isInvite.code}'`);
            console.log("request:", request);
            let isSaved = await doRequest(pool, request)
                .then((val) => {return [true, val];})
                .catch((err) => {return [false, err];});
            msg.delete();
            await pool.end()
                .then((val) => {console.log(val);})
                .catch((err) => {console.error(err);});
            savetodatabaseEmbed = new client.discord.MessageEmbed()
                .setTitle('Save to DB')
                .setDescription('I detect invite. Save to DB (' +Boolean(isSaved[0]) + '):\n```sql\n' + isSaved[1] +'```')
                .setColor(client.config.embedColor);
            return interaction.reply({ embeds: [savetodatabaseEmbed] });
        // no way to search server → https://discord.js.org/#/docs/discord.js/stable/class/Channel
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
            return interaction.reply({ embeds: [savetodatabaseEmbed] });
        } else {
            const savetodatabaseEmbed = new client.discord.MessageEmbed()
                .setTitle('Save to DB')
                .setDescription(`I detect no invite or server.`)
                .setColor(client.config.embedColor);
            return interaction.reply({ embeds: [savetodatabaseEmbed] });
        }

        //console.debug(isInvite, isChannel, isServer);
        //console.log(fetchedWidget.channels.map((channel) => [channel.id, channel.name]));
        //console.log(fetchedWidget.channels.mapValues((channel) => [channel.id, channel.name]));
    },
};
