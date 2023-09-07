const { SlashCommandBuilder, Component, ComponentType, MessageAttachment, AttachmentBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');

// Your prompt / workflow
module.exports = {
    data: new SlashCommandBuilder()
        .setName('facechanger')
        .setDescription('kendi yüklediğiniz yüz fotoğrafını kullanarak resimler oluşturun!')
        .addAttachmentOption(option => option.setName('image').setDescription('Değiştirmek istediğiniz fotoğrafı koyun!').setRequired(true))
        .addStringOption(option => option.setName('faceid').setDescription('faceid giriniz. varsayılan fotoğraf jennifer').setAutocomplete(true)),

    async autocomplete(interaction, client) {
        const { loadData, saveData } = require('../../process/jsonDataReaderWriter');
        const focusedValue = interaction.options.getFocused();
        var dataJSON = loadData();
        const choices = Object.keys(dataJSON).filter((key) => {
            return (dataJSON[key].user === interaction.user.id || dataJSON[key].isPublic) && !dataJSON[key].encrypted;
        });
        const filtered = choices.filter(choice => choice.startsWith(focusedValue));
        await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice })),
        );
    },
    async execute(interaction, client) {

        await interaction.deferReply({
            fetchReply: true
        });
        const { promptTxt } = require('../../workflows/facechanger');
        const Prompt = JSON.parse(promptTxt);

        var image = interaction.options.getAttachment('image');
        const faceid = interaction.options.getString('faceid') ?? 'jennifer';
        const response = await fetch(image.attachment);
        const buffer = await response.arrayBuffer();

        Prompt['13'].inputs.image = "TKMMFaceData/" + faceid;

        const { addProcessToList } = require('../../process/facechangerprocess');
        let sira = addProcessToList(Prompt, interaction, 'facechanger', buffer);


        await interaction.editReply({ content: `İşlem sıraya alındı!\nMevcut Sıranız: **${sira}**` });

    }

}