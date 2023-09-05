const { SlashCommandBuilder, Component, ComponentType, MessageAttachment, AttachmentBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');

// Your prompt / workflow
module.exports = {
    data: new SlashCommandBuilder()
        .setName('faceswap')
        .setDescription('kendi yüklediğiniz yüz fotoğrafını kullanarak resimler oluşturun!')
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
            { name: 'MeinaMixHentai', value: 'meinahentai_v4.safetensors' },
            { name: 'MeinaMixPastel', value: 'meinapastel_v6-inpainting.safetensors' },
            { name: 'UberRealistic', value: 'uberRealisticPornMerge_urpmv13.safetensors' }))
        .addStringOption(option => option.setName('vae').setDescription('checkpointe göre var belirtiniz').addChoices(
            { name: 'Default 840000 Vae', value: 'vae-ft-mse-840000-ema-pruned.ckpt' },
            { name: 'OrangeMix', value: 'orangemix.vae.pt' }))
        .addIntegerOption(option => option.setName('seed').setDescription('Seed'))
        .addStringOption(option => option.setName('faceid').setDescription('faceid giriniz. varsayılan fotoğraf jennifer').setAutocomplete(true))
        .addStringOption(option => option.setName('faceinfo').setDescription('mimikler'))
        .addIntegerOption(option => option.setName('steps').setDescription('Adım'))
        .addNumberOption(option => option.setName('cfg').setDescription('CFG'))
        .addIntegerOption(option => option.setName('width').setDescription('Genişlik'))
        .addIntegerOption(option => option.setName('height').setDescription('Yükseklik')),

    async autocomplete(interaction, client) {
        const { loadData, saveData } = require('../../process/jsonDataReaderWriter');
        var dataJSON = loadData();
        const choices = Object.keys(dataJSON).filter((key) => {
            return (dataJSON[key].user === interaction.user.id || dataJSON[key].isPublic) && !dataJSON[key].encrypted;
        });
        //const filtered = choices.filter(choice => choice.startsWith(focusedValue));
        await interaction.respond(
            choices.map(choice => ({ name: choice, value: choice })),
        );
    },
    async execute(interaction, client) {

        await interaction.deferReply({
            fetchReply: true
        });


        const { promptTxt } = require('../../workflows/face');

        const Prompt = JSON.parse(promptTxt);

        const faceidm = interaction.options.getString('faceid') ?? 'jennifer';

        
        Prompt['13'].inputs.image = 'TKMMFaceData/' + faceidm;
        Prompt['34'].inputs.image = 'TKMMChangerImages/' + photoID;

        const { loadData, saveData } = require('../../process/jsonDataReaderWriter');
        const dataJSON = loadData();
        if (!dataJSON.hasOwnProperty(faceidm)) {
            await interaction.editReply({ content: `Sıraya alınamadı, böyle bir yüz eklenmemiş! Kullanılmaya **çalışılan** yüz id: **${faceidm}** Public: **????**` });
            return;
        }
        if (dataJSON[faceidm].isPublic === false) {
            if (dataJSON[faceidm].user === interaction.user.id) {
                const { addProcessToList } = require('../../process/aiqueue');
                let sira = addProcessToList(Prompt, interaction, 'faceswap');

                await interaction.editReply({ content: `Sıraya alındı!\nMevcut sıranız: **${sira}**\nKullanılan yüz id: **${faceidm}** Public: **false**` });
            }
            else {
                await interaction.editReply({ content: `Sıraya alınamadı, lütfen **kendi yüklediğiniz** veya **public** olan bir yüz kullanın! Kullanılmaya **çalışılan** yüz id: **${faceidm}** Public: **false**` });
            }
        }
        else {
            const { addProcessToList } = require('../../process/aiqueue');
            let sira = addProcessToList(Prompt, interaction, 'faceswap');

            await interaction.editReply({ content: `Sıraya alındı!\n Mevcut sıranız: **${sira}**\n Kullanılan yüz id: **${faceidm}** Public: **true**` });

        }
        //Create client



    }

}