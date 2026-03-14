const { SlashCommandBuilder } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("join")
    .setDescription("加入語音頻道"),
  async execute(interaction) {
    if (!interaction.member.voice.channel) return interaction.reply("❌ 你必須在語音頻道中！");
    joinVoiceChannel({
      channelId: interaction.member.voice.channel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator
    });
    interaction.reply("✅ 已加入語音頻道！");
  }
};
