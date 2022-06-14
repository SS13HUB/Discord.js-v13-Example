
module.exports = {
    name: 'uncaughtException',
    enabled: true, // BROKEN

    /**
     * @param {ErrorException} error
     */
    async execute(error) {
        console.error(client.chalk.exct, `Uncaught Exception:`);
        console.error(error);
    }
}
