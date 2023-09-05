const { ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,

    async execute(client){
console.log(`${client.user.tag} giris yapti`);
client.user.setActivity('TKMM Alplerini ', ({type: ActivityType.Listening}))
    }
}