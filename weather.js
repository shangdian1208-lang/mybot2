const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const db = require("../utils/database");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("weather")
    .setDescription("查詢天氣")
    .addStringOption(opt => opt.setName("city").setDescription("城市名稱").setRequired(true)),
  async execute(interaction) {
    const city = interaction.options.getString("city");
    const data = db.readDB();
    if (!data.settings || !data.settings.weatherChannel || interaction.channel.id !== data.settings.weatherChannel)
      return interaction.reply("❌ 這個頻道不能使用天氣指令！");
    try {
      const key = process.env.WEATHER;
      const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric&lang=zh_tw`);
      const w = res.data;
      interaction.reply(`🌦 ${w.name} 天氣: ${w.weather[0].description}\n溫度: ${w.main.temp}°C\n濕度: ${w.main.humidity}%`);
    } catch(e) {
      interaction.reply("❌ 查詢天氣失敗！");
    }
  }
};
