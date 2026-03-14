const { SlashCommandBuilder } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leave")
    .setDescription("離開語音頻道"),
  async execute(interaction) {
    const connection = getVoiceConnection(interaction.guild.id);
    if (!connection) return interaction.reply("❌ 我不在語音頻道！");
    connection.destroy();
    interaction.reply("✅ 已離開語音頻道！");
  }
};
