const { Events, ModalBuilder } = require('discord.js');

module.exports = {
    name: 'interactionCreate',

    async execute(interaction, client) {
        if (!interaction.isModalSubmit()) return;

        if (interaction.customId === 'EditPromptModal') {
            const parsedData = {};
            const data = interaction.fields.getTextInputValue('otherDatas');
            const lines = data.trim().split('\n');

            lines.forEach(line => {
                const [key, value] = line.split(':');

                if (value !== '' && key !== '') {

                    parsedData[key.trim()] = value.replace(',', '.');
                }

            });


            const { getRND, searchData } = require('../../process/globalProcessInfo');
            const results = searchData('messageid', interaction.message.id);
            var proc = results;
            const newPROMPT = JSON.stringify(proc[0].prompt);
            const edited = JSON.parse(newPROMPT);

            if (proc[0].type === 'faceswap') {
                edited['13'].inputs.image = 'TKMMFaceData/' + parsedData.faceid;
                edited['19'].inputs.text = parsedData.faceinfo
            }

            if (proc[0].type === 'sdxl') {
                edited['40'].inputs.string = interaction.fields.getTextInputValue('positive');
                edited['41'].inputs.string = interaction.fields.getTextInputValue('negative');
            }
            else {
                edited['4'].inputs.text = interaction.fields.getTextInputValue('positive');
                edited['5'].inputs.text = interaction.fields.getTextInputValue('negative');
            }

            edited['8'].inputs.cfg = parsedData.cfg ?? 8;
            edited['8'].inputs.seed = parsedData.seed ?? Math.floor(Math.random() * 100000000);
            edited['8'].inputs.steps = parsedData.steps ?? 20;
            if (proc[0].type === 'sdxl') {
                edited['36'].inputs.value = parsedData.width ?? 1024;
                edited['37'].inputs.value = parsedData.height ?? 1024;
            }
            else {
                edited['9'].inputs.width = parsedData.width ?? 512;
                edited['9'].inputs.height = parsedData.height ?? 512;
            }

            const { addProcessToList } = require('../../process/aiqueue');
            await interaction.deferReply({
                fetchReply: true
            });
            let sira = addProcessToList(edited, interaction, proc[0].type);
            await interaction.editReply({ content: `isteklerinizin tamamı alınarak yeniden sıraya alındı!\nMevcut sıranız: ${sira}` });

        }



    }
}