const { SlashCommandBuilder } = require('discord.js');
const { v4: uuidv4 } = require('uuid');
const {encrypt, decrypt} = require('../../process/cryptor');
const { comfyuipath } = process.env;
module.exports = {
    data: new SlashCommandBuilder()
    .setName('facepassword')
    .setDescription('Yüklediğiniz yüzü dilediğiniz gibi şifreleyin!')
    .addStringOption(option => option.setName('işlem')
    .setDescription('Şifrele/Çöz').setRequired(true).addChoices({name:'Şifrele', value:'encrypt'}, {name:'Çöz', value:'decrypt'}))
    .addStringOption(option => option.setName('password').setDescription('Unutmayacağınız bir şifre girin MDK\'de bile olmayacak bu şifre!').setRequired(true))
    .addStringOption(option => option.setName('faceid').setDescription('İşleme alınacak yüz id\'sini yazın').setAutocomplete(true).setRequired(true)),
    async autocomplete(interaction, client) {
		const { loadData, saveData } = require('../../process/jsonDataReaderWriter');
        var dataJSON = loadData();

        const focusedOption = interaction.options.getFocused(true);
        //console.log(interaction.options._hoistedOptions);
		if(focusedOption.name === 'faceid'){
            var SelectedProc = true;
            if(interaction.options.getString('işlem') == 'encrypt'){
                SelectedProc = false;
            }
            const choices = Object.keys(dataJSON).filter((key) => {
                return dataJSON[key].user === interaction.user.id && !dataJSON[key].isPublic && dataJSON[key].encrypted === SelectedProc;
              });
            //const filtered = choices.filter(choice => choice.startsWith(focusedValue));
            await interaction.respond(
                choices.map(choice => ({ name: choice, value: choice })),
            );
        }
	},
    async execute(interaction, client){
        const message = await interaction.deferReply({
            fetchReply: true,ephemeral: true
        });

        const { encrypt, decrypt } = require('../../process/cryptor');
        const pass = interaction.options.getString('password');
        const faceidm = interaction.options.getString('faceid');
        const { loadData, saveData } = require('../../process/jsonDataReaderWriter');
        var dataJSON = loadData();
        var mesaj = 'TEST';
        if(interaction.options.getString('işlem') === 'encrypt' && !dataJSON[faceidm].encrypted){
            const path = `${comfyuipath}ComfyUI/input/TKMMFaceData/${faceidm}`;
            encrypt(pass, path, `./EncryptedFaceData/${faceidm}`, faceidm);
            mesaj = `Başarıyla Şifrelendi: ${faceidm}`;
        }
        else if(interaction.options.getString('işlem') === 'decrypt' && dataJSON[faceidm].encrypted){
            const path = `./EncryptedFaceData/${faceidm}`;
            decrypt(pass, path, `${comfyuipath}ComfyUI/input/TKMMFaceData/${faceidm}`, faceidm);
            mesaj = `Eğer şifreniz doğruysa çözüldü \\:) ${faceidm}`;
        }
        else{
            mesaj = `Bir şeyler ters gidiyor lütfen komutu tekrar sırası ile uygula!\nİlk olarak işlemi seç sonrasında faceid seç!`;
        }

        await interaction.editReply({
            content: mesaj, ephemeral: true
        });
    }
}