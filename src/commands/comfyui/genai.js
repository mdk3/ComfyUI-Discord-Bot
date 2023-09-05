const { SlashCommandBuilder, Component, ComponentType, MessageAttachment, AttachmentBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');

// Your prompt / workflow
module.exports = {
    data: new SlashCommandBuilder()
        .setName('generate')
        .setDescription('ai!')
        .addStringOption(option => option.setName('positive').setDescription('Pozitif'))
        .addStringOption(option => option.setName('negative').setDescription('Negatif'))
        .addStringOption(option => option.setName('sampler').setDescription('Kullanılacak sampler, varsayılan eular').addChoices(
            { name: 'Eular', value: 'euler' },
            { name: 'Eular A', value: 'euler_ancestral' },
            { name: 'LMS', value: 'lms' },
            { name: 'DPM++ SDE', value: 'dpmpp_sde_gpu' },
            { name: 'DPM++ 2M SDE', value: 'dpmpp_2m_sde_gpu' },
            { name: 'DPM++ 2S A', value: 'dpmpp_2s_ancestral' },
            { name: 'DDIM', value: 'ddim' }))
        .addStringOption(option => option.setName('scheduler').setDescription('Kullanılacak sampler, varsayılan eular').addChoices(
            { name: 'Normal', value: 'normal' },
            { name: 'Karras', value: 'karras' },
            { name: 'Exponential', value: 'exponential' },
            { name: 'Simple', value: 'simple' },
            { name: 'Ddim Uniform', value: 'ddim_uniform' }))
        .addStringOption(option => option.setName('checkpoint').setDescription('Kullanılacak model, varsayılan epicrealism').addChoices(
            { name: 'EpicRealism', value: 'epicrealism_pureEvolutionV5.safetensors' },
            { name: 'RealisticVision', value: 'realisticVisionV51_v51VAE.safetensors' },
            { name: 'MajicmixRealistic', value: 'majicmixRealistic_betterV2V25.safetensors' },
            { name: 'AbsoluteReality', value: 'absolutereality_v181.safetensors' },
            { name: 'CyberRealistic', value: 'cyberrealistic_v32-inpainting.safetensors' },
            { name: 'DreamShaper', value: 'dreamshaper_8.safetensors' },
            { name: 'RevAnimated', value: 'revAnimated_v121.safetensors' },
            { name: 'MeinaMix', value: 'meinamix_meinaV11.safetensors' },
            { name: 'MeinaMixHentai', value: 'meinahentai_v4.safetensors'},
            { name: 'MeinaMixPastel', value: 'meinapastel_v6-inpainting.safetensors' }))
        .addStringOption(option => option.setName('vae').setDescription('checkpointe göre vae belirtiniz').addChoices(
            { name: 'Default 840000 Vae', value: 'vae-ft-mse-840000-ema-pruned.ckpt' },
            { name: 'OrangeMix', value: 'orangemix.vae.pt' }
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


        const { promptTxt } = require('../../workflows/generatenormal');

        const Prompt = JSON.parse(promptTxt);


        Prompt['1'].inputs.ckpt_name = interaction.options.getString('checkpoint') ?? 'epicrealism_pureEvolutionV5.safetensors';
        Prompt['3'].inputs.vae_name = interaction.options.getString('vae') ?? 'vae-ft-mse-840000-ema-pruned.ckpt';

        // Prompt['19'].inputs.text = interaction.options.getString('faceinfo') ?? 'high detailed face';
        // Set the text prompt for our positive CLIPTextEncode
        Prompt['4'].inputs.text = interaction.options.getString('positive') ?? ' ';
        Prompt['5'].inputs.text = interaction.options.getString('negative') ?? ' ';

        // // Set the seed for our KSampler node
        Prompt['8'].inputs.steps = interaction.options.getInteger('steps') ?? 30;
        Prompt['8'].inputs.cfg = interaction.options.getNumber('cfg') ?? 8;
        Prompt['8'].inputs.sampler_name = interaction.options.getString('sampler') ?? 'euler';
        Prompt['8'].inputs.scheduler = interaction.options.getString('scheduler') ?? 'normal';
        Prompt['8'].inputs.seed = interaction.options.getInteger('seed') ?? Math.floor(Math.random() * 1000000000000);

        Prompt['9'].inputs.width = interaction.options.getInteger('width') ?? 512;
        Prompt['9'].inputs.height = interaction.options.getInteger('height') ?? 512;
        //console.log(Prompt);

        const { addProcessToList } = require('../../process/aiqueue');
        let sira = addProcessToList(Prompt, interaction, 'genai');

        await interaction.editReply({ content: `Sıraya alındı!\nMevcut sıranız: **${sira}**` });
        //Create client



    }








}