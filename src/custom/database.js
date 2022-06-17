

if ((require.main == null) || (!require.main.filename.endsWith('\\index.js'))) {
    throw `"${__filename}":\nThis file must be imported from index file.`;
}

const process = require('process');
const index = require(process.cwd() + '\\index');
const client = index.client;

const base_path = client.g.cwd() + '\\data\\database\\Guilds\\';
const db_guilds_create = base_path + 'create.sql';
const db_guilds_drop   = base_path + 'drop.sql';
const db_guilds_insert = base_path + 'insert.sql';
const db_guilds_select = base_path + 'select.sql';

module.exports = { 
    log   : chalk.bgWhiteBright.black(`[LOG]`),
    ok    : chalk.bgGreen.black(`✔️ `),
    err   : chalk.bgRed.black(`❌ `),
    load  : chalk.bgBlue.black(`[LOAD]`),
    exit  : chalk.bgRedBright.black(`[SIGINT]`),
    fatal : chalk.bgRedBright.black(`[FATAL]`),
    exct  : chalk.bgRedBright.black(`[Exception]`),
    event : chalk.bgWhiteBright.black(`[EVENT]`),
    cmd   : chalk.bgYellow.black(`[CMD]`),
}
