
const { Formatters } = require('discord.js');
const chalkMy = require("./../../src/chalk");

module.exports = {
    name: 'modalSubmit',

    /**
     * @param {Modal} modal
     */
    async execute(modal, interaction, client) {
        //let modal = interaction.fields[0];
        console.log(chalkMy.event, `Event fired: "modalSubmit".`);
        //console.log("\n\nmodal:\n", modal);
        if (modal.customId === 'modal-customid') {
            const firstResponse = modal.getTextInputValue('textinput-customid');
            //client.channels.cache.get(process.env.LOG_CHANNEL_ID).send({ content: `modalSubmit event fired`});
            await modal.reply('Congrats! Powered by discord-modals.' + Formatters.codeBlock('markdown', firstResponse));
        }
    }
}
