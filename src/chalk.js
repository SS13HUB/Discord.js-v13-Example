
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
}
