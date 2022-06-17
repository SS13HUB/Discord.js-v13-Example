
module.exports = {
    name: 'unhandledRejection',
    enabled: true, // BROKEN

    /**
     * @param {ErrorException} error
     */
    async execute(error) {
        console.error(client.g.chalk.fatal, `Possibly Unhandled Rejection:`);
        console.error(promise);
        console.error(reason);
        //console.error(`httpStatus: ${reason.httpStatus}, reason: ${reason.message}`);
        /// Below - detailing for 'DiscordAPIError: Invalid Form Body'
        if (!reason.requestData) return;
        if (!reason.requestData['json']) return;
        if (reason.code == 50035 || reason.message == 'Invalid Form Body') {
            if (reason.requestData['json'] == []) return;
            if (!reason.requestData['json'][0].name || !reason.requestData['json'][0].description) return;
            for (let i = 0; i < reason.requestData['json'].length; i++) {
                let cmd  = reason.requestData['json'][i];
                let ii   = i < 10 ? ` ${i}`: i;
                let iii  = cmd.name.length < 10 ? ` ${cmd.name.length}`: cmd.name.length;
                let iiii = cmd.description.length < 100 ? cmd.description.length < 10 ? `  ${cmd.description.length}`: ` ${cmd.description.length}`: cmd.description.length;
                console.error(`[${ii}/${reason.requestData['json'].length - 1}] (${iii}/32;${iiii}/100) '${cmd.name}', '${cmd.description}'`);
            }
            //console.error(reason.requestData['json']);
        } else {
            console.error(reason.requestData['json']);
        }
    }
}
