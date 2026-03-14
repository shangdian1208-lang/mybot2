const { SlashCommandBuilder } = require("discord.js");
const { createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus } = require("@discordjs/voice");
const ytdl = require("ytdl-core");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("播放音樂")
    .addStringOption(opt => opt.setName("url").setDescription("YouTube 連結").setRequired(true)),
  async execute(interaction) {
    const url = interaction.options.getString("url");
    if (!interaction.member.voice.channel) return interaction.reply("❌ 你必須在語音頻道！");
    const connection = joinVoiceChannel({
      channelId: interaction.member.voice.channel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator
    });
    const stream = ytdl(url, { filter: "audioonly" });
    const resource = createAudioResource(stream);
    const player = createAudioPlayer();
    player.play(resource);
    connection.subscribe(player);
    interaction.reply(`🎵 正在播放: ${url}`);
  }
};
