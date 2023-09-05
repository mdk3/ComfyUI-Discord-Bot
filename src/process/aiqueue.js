//const { ComfyUIClient, Prompt } = require('comfy-ui-client');
const {ComfyUIClient, Prompt} = require('../../extended_node_modules/comfy-ui-client')
const { SlashCommandBuilder, MessageAttachment, AttachmentBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { v4: uuidv4 } = require('uuid');
const { globalDataAdd, GLOBALQUEUE } = require('../process/globalProcessInfo');
let isProcessing = false;
const { comfyuipath } = process.env;

function addProcessToList(prompt, interaction, type) {
    GLOBALQUEUE.push({ prompt, interaction, type });
    //console.log(prompt['8'].inputs.seed);
    ProcessQueue();
    return GLOBALQUEUE.length;
}

function getPromise() {
    return new Promise((resolve, reject) => {
        isProcessing = true;
        const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('button1')
                    .setLabel('🎲')
                    .setStyle(ButtonStyle.Success),

                new ButtonBuilder()
                    .setCustomId('button2')
                    .setLabel('⬆️')
                    .setStyle(ButtonStyle.Success),

                new ButtonBuilder()
                    .setCustomId('button3')
                    .setLabel('✒️')
                    .setStyle(ButtonStyle.Success),

                new ButtonBuilder()
                    .setCustomId('button4')
                    .setLabel('🗑️')
                    .setStyle(ButtonStyle.Danger),


            )

        const proc = GLOBALQUEUE[0];
        if (proc.type === 'faceswap') {
            const { loadData, saveData } = require('../process/jsonDataReaderWriter');
            const dataJSON = loadData();
            const faceidm = proc.prompt['13'].inputs.image.toString().split('/')[1];
            console.log(faceidm);
            if (!dataJSON.hasOwnProperty(faceidm)) {

                const interactionResponse = {
                    content: `Sıraya alınamadı, böyle bir yüz eklenmemiş! Kullanılmaya **çalışılan** yüz id: **${faceidm}** Public: **????**`
                };
                const result = {
                    solve1: interactionResponse,
                    procc: proc,
                    solve2: 'blank'
                };
                return resolve(result);
            }


            if (dataJSON[faceidm].isPublic === false) {
                if (dataJSON[faceidm].user !== proc.interaction.user.id) {
                    const interactionResponse = {
                        content: `Sıraya alınamadı, lütfen **kendi yüklediğiniz** veya **public** olan bir yüz kullanın! Kullanılmaya **çalışılan** yüz id: **${faceidm}** Public: **false**`
                    };
                    const result = {
                        solve1: interactionResponse,
                        procc: proc,
                        solve2: 'blank'
                    };
                    return resolve(result);
                }
            }
        }


        if (proc.type === 'sdxl') {
            if (proc.prompt['8'].inputs.steps > 45) {
                proc.prompt['8'].inputs.steps = 20;
            }

            if (proc.prompt['36'].inputs.value > 2048) {
                proc.prompt['36'].inputs.value = 1024;
            }

            if (proc.prompt['37'].inputs.value > 2048) {
                proc.prompt['37'].inputs.value = 1024;
            }
        }
        else {
            if (proc.prompt['8'].inputs.steps > 60) {
                proc.prompt['8'].inputs.steps = 30;
            }

            if (proc.prompt['9'].inputs.width > 1024) {
                proc.prompt['9'].inputs.width = 512;
            }

            if (proc.prompt['9'].inputs.height > 1024) {
                proc.prompt['9'].inputs.height = 512;
            }
        }


        const serverAddress = '127.0.0.1:8188';
        const clientId = uuidv4();
        const client_comfy = new ComfyUIClient(serverAddress, clientId);

        client_comfy.eventTetikleyici.on('progress', async (data) => {
            if (proc.type === 'sdxl') {
                SendProgressRealTime(proc.interaction, `\`Seed: ${proc.prompt['8'].inputs.seed}\nSteps: ${proc.prompt['8'].inputs.steps}\nWidth: ${proc.prompt['36'].inputs.value}\nHeight: ${proc.prompt['37'].inputs.value}\`\n`, data);
            }
            else {
                SendProgressRealTime(proc.interaction, `\`Seed: ${proc.prompt['8'].inputs.seed}\nSteps: ${proc.prompt['8'].inputs.steps}\nWidth: ${proc.prompt['9'].inputs.width}\nHeight: ${proc.prompt['9'].inputs.height}\`\n`, data);
            }
        })

        client_comfy.eventTetikleyici.on('progressEnd', async (data) => {
            await proc.interaction.editReply({ content: `Gönderime Hazır!\nTamamlanma Durumu: **${data}**` });
        })


        client_comfy.connect()
            .then(() => client_comfy.getImages(proc.prompt))
            .then(images => {
                return client_comfy.disconnect().then(() => images);
            })
            .then(images => {
                const path = `${comfyuipath}ComfyUI/${images['33'][0].image.type}/${images['33'][0].image.filename}`;
                const path_upscaled = `${comfyuipath}ComfyUI/${images['32'][0].image.type}/${images['32'][0].image.filename}`;
                const interactionResponse = {
                    content: `İşlem Tamamlandı! ${proc.interaction.user}\nseed: **${proc.prompt['8'].inputs.seed}**`, files: [path], components: [button]
                };

                const result = {
                    solve1: interactionResponse,
                    procc: proc,
                    solve2: path_upscaled
                };

                return resolve(result);
            })
            .catch(error => {
                reject(error);
            });
    });
}
let isSending = false;
const animationFrames = ['/', '-', '\\', '|'];
let animationFrameIndex = 0;
async function SendProgressRealTime(inter, mesajHeader, data) {
    if (isSending) {
        return;
    }
    const animationFrame = animationFrames[animationFrameIndex];
    isSending = true;
    const percentage = (data.value / data.max) * 100;
    const barLength = Math.round((percentage / 100) * 20);
    const progressBar = '■'.repeat(barLength) + ' '.repeat(20 - barLength);
    await inter.editReply({ content: `${mesajHeader}İşleniyor ${animationFrame} \nTamamlanma Durumu: \n\`${progressBar}\` %${percentage.toFixed(2)}` });
    animationFrameIndex = (animationFrameIndex + 1) % animationFrames.length;
    isSending = false;
}


async function ProcessQueue() {

    if (isProcessing || GLOBALQUEUE.length === 0) return;
    const respp = await getPromise();

    const channelId = respp.procc.interaction.channelId;
    const channel = await respp.procc.interaction.guild.channels.fetch(channelId);

    const message = await channel.send(respp.solve1);
    await respp.procc.interaction.editReply('Gönderildi!\nTamamlanma Durumu: **Tamamlandı!**')
    globalDataAdd(respp.procc.prompt, message.id, respp.procc.interaction.user.id, respp.solve2, respp.procc.type);
    GLOBALQUEUE.shift();

    isProcessing = false;
    ProcessQueue();
}

module.exports = {
    addProcessToList,
};