//const { ComfyUIClient, Prompt } = require('comfy-ui-client');
const {ComfyUIClient, Prompt} = require('../../extended_node_modules/comfy-ui-client')
const { v4: uuidv4 } = require('uuid');
let isProcessing = false;
const ProcessList = [];

function addProcessToList(isPublic, buffer, faceid, interaction) {
    ProcessList.push({ isPublic, buffer, faceid, interaction });
    ProcessQueue();
}

async function ProcessQueue() {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (isProcessing || ProcessList.length === 0) return;


    isProcessing = true;
    const proc = ProcessList[0];
    const serverAddress = '127.0.0.1:8188';
    const clientId = uuidv4();
    const client_comfy = new ComfyUIClient(serverAddress, clientId);
    await client_comfy.connect();
    const statusupload = await client_comfy.uploadImage(proc.buffer, 'TKMMFaceData/' + proc.faceid);

    //console.log(statusupload)

    // Disconnect
    await client_comfy.disconnect();

    const interactionResponse = {
        content: `Yüz yükleme işlemi tamamlandı! ${proc.interaction.user}\n**${statusupload.name.split('/')[1]}** id'si ile kullanabilirsiniz!`, ephemeral: true
    }
    const { loadData, saveData } = require('./jsonDataReaderWriter');
    const data = loadData();
    data[statusupload.name.split('/')[1]] = {
        user: proc.interaction.user.id,
        isPublic: proc.isPublic,
        encrypted: false,
        hash: ""
    }
    saveData(data);

    await proc.interaction.followUp(interactionResponse);
    ProcessList.shift();
    isProcessing = false;
    ProcessQueue();
}

module.exports = {
    addProcessToList,
};