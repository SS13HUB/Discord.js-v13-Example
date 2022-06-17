
if ((require.main == null) || (!require.main.filename.endsWith('\\index.js'))) {
    throw `"${__filename}":\nThis file must be imported from index file.`;
}

/*
console.log('require.main:', require.main.exports);
console.log('require.main:', typeof require.main.exports);
process.exit();
*/

const chalk = require("chalk");

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
