const { SlashCommandBuilder, MessageAttachment, AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage, Image } = require('canvas');

// Your prompt / workflow
module.exports = {
    data: new SlashCommandBuilder()
        .setName('faceupload')
        .setDescription('face dataset!')
        .addAttachmentOption(option => option.setName('image').setDescription('Tam yüzü gözüken kaliteli bir fotoğraf koyunuz!').setRequired(true))
        .addBooleanOption(option => option.setName('public').setDescription('Bu idyi sizin dışınızda herkes kullanabilir mi?'))
        .addStringOption(option => option.setName('faceid').setDescription('Kullanabilmeniz için özel bir isim koyabilirsiniz.')),

    async execute(interaction, client) {

        await interaction.deferReply({
            fetchReply: true, ephemeral: true
        });

        
        var image = interaction.options.getAttachment('image');

        let isPublic = interaction.options.getBoolean('public') ?? false;
        const faceid = interaction.options.getString('faceid') ?? image.name;
        const response = await fetch(image.attachment);
        const buffer = await response.arrayBuffer();
        
        const{addProcessToList} = require('../../process/faceUploadQueue');
        addProcessToList(isPublic, buffer, faceid.replace('/', '-'), interaction);
        

        await interaction.editReply({content: `İşlem sıraya alındı!`, ephemeral: true});
    }








}