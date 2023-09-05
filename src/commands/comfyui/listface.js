const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('facelist')
    .setDescription('Yüklenen yüzleri listeleyin!'),

    async execute(interaction, client){
        
        await interaction.deferReply({
            fetchReply: true
        });

        const{loadData}=require('../../process/jsonDataReaderWriter');
        const dataJSON = loadData();
        const ObjectK = Object.keys(dataJSON);
        var newMessage = '';
        for (let index = 0; index < ObjectK.length; index++) {
            const element = ObjectK[index];
            newMessage += `${index +1}-) **${element}** Public: ${dataJSON[element].isPublic}\n`;
        }

        await interaction.editReply({
            content: newMessage
        });
    }
}