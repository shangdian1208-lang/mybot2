const {SlashCommandBuilder}=require("discord.js")
const {joinVoiceChannel}=require("@discordjs/voice")

module.exports={

data:new SlashCommandBuilder()
.setName("join")
.setDescription("加入語音頻道"),

async execute(interaction){

const channel=interaction.member.voice.channel

if(!channel){

 interaction.reply("請先加入語音頻道")
 return

}

joinVoiceChannel({

 channelId:channel.id,
 guildId:interaction.guild.id,
 adapterCreator:interaction.guild.voiceAdapterCreator

})

interaction.reply("已加入語音")

}

}