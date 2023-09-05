const { SlashCommandBuilder } = require('discord.js');
const { v4: uuidv4 } = require('uuid');



module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Pingi ölç!'),

    async execute(interaction, client){
        const message = await interaction.deferReply({
            fetchReply: true
        });
        const randomId = uuidv4();
        
        const newMessage = `ID: ${randomId}\nAPI Ping: ${client.ws.ping}\nClient Ping: ${message.createdTimestamp - interaction.createdTimestamp}`;
        await interaction.editReply({
            content: newMessage
        });
    }
}