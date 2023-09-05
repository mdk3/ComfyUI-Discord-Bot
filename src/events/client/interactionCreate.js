const { ModalBuilder, Events, TextInputStyle, TextInputBuilder, ActionRowBuilder } = require('discord.js');
module.exports = {
    name: 'interactionCreate',

    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const { commands } = client;
            const { commandName } = interaction;
            const command = commands.get(commandName);
            if (!command) return;

            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: `Bir şeyler ters gidiyor MDK ile görüş!`,
                    ephemeral: true
                })
            }
        }
        else if (interaction.isAutocomplete()) {
            const command = interaction.client.commands.get(interaction.commandName);
    
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
    
            try {
                await command.autocomplete(interaction, client);
            } catch (error) {
                console.error(error);
            }
        }

        if (interaction.isButton()) {
            const { getRND, searchData } = require('../../process/globalProcessInfo');
            const results = searchData('messageid', interaction.message.id);
            var proc = results;

            if (proc.length === 0) {
                return interaction.reply({ content: 'Süresi dolmuş lütfen yeni fotoğraf üretin!.', ephemeral: true });

            }

            if (interaction.user.id !== proc[0].author) {
                return interaction.reply({ content: 'Sadece komutu kullanan kişi bu işlemi gerçekleştirebilir.', ephemeral: true });
            }

            if (interaction.customId === 'button1') {
                const { addProcessToList } = require('../../process/aiqueue');
                var seed = await getRND();
                const newPROMPT = JSON.stringify(proc[0].prompt);

                const edited = JSON.parse(newPROMPT);
                edited['8'].inputs.seed = seed;
                await interaction.deferReply({
                    fetchReply: true
                });
                let sira = addProcessToList(edited, interaction, proc[0].type);
                await interaction.editReply({ content: `seed:**${edited['8'].inputs.seed}** değiştirilerek yeniden sıraya alındı!\nMevcut sıranız: ${sira}` });

            }

            if (interaction.customId === 'button2') {
                await interaction.reply({ content: `int hızından dolayı gönderim yapılamıyor, kayıt edildi dizin: ${proc[0].upscaled}` })
                //await interaction.reply({content:'UpScaled!', files: [proc[0].upscaled]})
            }

            if (interaction.customId === 'button3') {

                const type = proc[0].type;
                const newPROMPT = JSON.stringify(proc[0].prompt);
                const edited = JSON.parse(newPROMPT);

                const modal = new ModalBuilder()
                    .setCustomId('EditPromptModal')
                    .setTitle('Prompt Düzenleyici');

                // Add components to modal

                // Create the text input components
                const positive = new TextInputBuilder()
                    .setCustomId('positive')
                    .setLabel("Pozitif")
                    .setStyle(TextInputStyle.Paragraph);

                const negative = new TextInputBuilder()
                    .setCustomId('negative')
                    .setLabel("Negatif")
                    .setStyle(TextInputStyle.Paragraph);

                if(type === 'sdxl'){
                    positive.setValue(edited['40'].inputs.string.toString());
                    negative.setValue(edited['41'].inputs.string.toString());
                }
                else{
                    positive.setValue(edited['4'].inputs.text.toString());
                    negative.setValue(edited['5'].inputs.text.toString())
                }
                
                
                
                

                const dataArray = [];

                dataArray.push(`cfg:${edited['8'].inputs.cfg.toString()}`);

                dataArray.push(`seed:${edited['8'].inputs.seed.toString()}`);
                dataArray.push(`steps:${edited['8'].inputs.steps.toString()}`);
                if(type === 'sdxl'){
                    dataArray.push(`width:${edited['36'].inputs.value.toString()}`);
                    dataArray.push(`height:${edited['37'].inputs.value.toString()}`);
                }
                else{
                    dataArray.push(`width:${edited['9'].inputs.width.toString()}`);
                    dataArray.push(`height:${edited['9'].inputs.height.toString()}`);
                }
                

                if(type === 'faceswap'){
                    dataArray.push(`faceid:${edited['13'].inputs.image.toString().split('/')[1]}`);
                    dataArray.push(`faceinfo:${edited['19'].inputs.text.toString()}`);
                }


                const otherDatas = new TextInputBuilder()
                .setCustomId('otherDatas')
                .setValue(dataArray.join('\n'))
                .setLabel("Diğer Ayarlar")
                .setStyle(TextInputStyle.Paragraph);

                const positiveActionRow = new ActionRowBuilder().addComponents(positive);
                const negativeActionRow = new ActionRowBuilder().addComponents(negative);
                const otherDatasActionRow = new ActionRowBuilder().addComponents(otherDatas);

                modal.addComponents(positiveActionRow, negativeActionRow, otherDatasActionRow);
                await interaction.showModal(modal);
            }
            
            if(interaction.customId === 'button4'){
                const channel = interaction.channel;
                try{
                    const messageToDelete = await channel.messages.fetch(interaction.message.id);
                    if(messageToDelete){
                        messageToDelete.delete();
                        return;
                    }
                }
                catch (error){
                    console.log('Hata oluştu!');
                    return;
                }


            }
            
        }
    }
}