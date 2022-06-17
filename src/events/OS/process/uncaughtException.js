
module.exports = {
    name: 'uncaughtException',
    enabled: true, // BROKEN

    /**
     * @param {ErrorException} error
     */
    async execute(error) {
        console.error(client.g.chalk.exct, `Uncaught Exception:`);
        console.error(error);
    }
}
