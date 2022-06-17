
module.exports = {
    name: 'SIGTERM',
    enabled: true,

    /**
     * @param {ErrorException} error
     */
    async execute(error) {
        console.log(client.g.chalk.exit, `Caught termination signal.`);
        /* try {
            client.user.setStatus('invisible');
        } catch (e) {
            console.log(client.g.chalk.fatal, `Can not set status.`);
        } */
        if (client.isReady()) client.user.setStatus('invisible');
        /* client.guilds.cache.forEach(guild => {
            if (client.playerManager.get(guild)) client.playerManager.leave(guild);
        }); */
        client.destroy();
        process.exit();
    }
}
