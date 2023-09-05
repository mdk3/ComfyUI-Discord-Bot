const { SlashCommandBuilder, Component, ComponentType, MessageAttachment, AttachmentBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');

// Your prompt / workflow
module.exports = {
    data: new SlashCommandBuilder()
        .setName('sdxl')
        .setDescription('SDXL 1.0 modelini kullan!')
        .addStringOption(option => option.setName('positive').setDescription('Pozitif'))
        .addStringOption(option => option.setName('negative').setDescription('Negatif'))
        .addStringOption(option => option.setName('sampler').setDescription('Kullanılacak sampler, varsayılan eular').addChoices(
            { name: 'Eular', value: 'euler' },
            { name: 'Eular A', value: 'euler_ancestral' },
            { name: 'LMS', value: 'lms' },
            { name: 'DPM++ SDE', value: 'dpmpp_sde_gpu' },
            { name: 'DPM++ 2M SDE', value: 'dpmpp_2m_sde_gpu' },
            { name: 'DPM++ 2S A', value: 'dpmpp_2s_ancestral' },
            { name: 'DPM++ 3M SDE', value: 'dpmpp_3m_sde_gpu' },
            { name: 'Uni Pc', value:'uni_pc'},
            { name: 'DDIM', value: 'ddim' }))
        .addStringOption(option => option.setName('scheduler').setDescription('Kullanılacak sampler, varsayılan eular').addChoices(
            { name: 'Normal', value: 'normal' },
            { name: 'Karras', value: 'karras' },
            { name: 'Exponential', value: 'exponential' },
            { name: 'Sgm Uniform', value: 'sgm_uniform' },
            { name: 'Simple', value: 'simple' },
            { name: 'Ddim Uniform', value: 'ddim_uniform' }))
        .addStringOption(option => option.setName('checkpoint').setDescription('Kullanılacak model, varsayılan SDXL Base 1.0').addChoices(
            { name: 'SDXL 1.0', value: 'sd_xl_base_1.0_0.9vae.safetensors' }))
        .addStringOption(option => option.setName('vae').setDescription('checkpointe göre vae belirtiniz').addChoices(
            { name: 'SDXL Vae', value: 'sdxl_vae.safetensors' }
        ))
        .addIntegerOption(option => option.setName('seed').setDescription('Seed'))
        .addIntegerOption(option => option.setName('steps').setDescription('Adım'))
        .addNumberOption(option => option.setName('cfg').setDescription('CFG'))
        .addIntegerOption(option => option.setName('width').setDescription('Genişlik'))
        .addIntegerOption(option => option.setName('height').setDescription('Yükseklik')),

    async execute(interaction, client) {

        await interaction.deferReply({
            fetchReply: true
        });


        const { promptTxt } = require('../../workflows/sdxl');

        const Prompt = JSON.parse(promptTxt);


        Prompt['1'].inputs.ckpt_name = interaction.options.getString('checkpoint') ?? 'sd_xl_base_1.0_0.9vae.safetensors';
        Prompt['3'].inputs.vae_name = interaction.options.getString('vae') ?? 'sdxl_vae.safetensors';

        // Prompt['19'].inputs.text = interaction.options.getString('faceinfo') ?? 'high detailed face';
        // Set the text prompt for our positive CLIPTextEncode
        Prompt['40'].inputs.string = interaction.options.getString('positive') ?? ' ';
        Prompt['41'].inputs.string = interaction.options.getString('negative') ?? ' ';

        // // Set the seed for our KSampler node
        Prompt['8'].inputs.steps = interaction.options.getInteger('steps') ?? 30;
        Prompt['8'].inputs.cfg = interaction.options.getNumber('cfg') ?? 8;
        Prompt['8'].inputs.sampler_name = interaction.options.getString('sampler') ?? 'euler';
        Prompt['8'].inputs.scheduler = interaction.options.getString('scheduler') ?? 'normal';
        Prompt['8'].inputs.seed = interaction.options.getInteger('seed') ?? Math.floor(Math.random() * 1000000000000);

        Prompt['36'].inputs.value = interaction.options.getInteger('width') ?? 1024;
        Prompt['37'].inputs.value = interaction.options.getInteger('height') ?? 1024;
        //console.log(Prompt);

        const { addProcessToList } = require('../../process/aiqueue');
        let sira = addProcessToList(Prompt, interaction, 'sdxl');

        await interaction.editReply({ content: `Sıraya alındı!\nMevcut sıranız: **${sira}**` });
        //Create client



    }








}