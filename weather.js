const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("weather")
    .setDescription("查詢城市天氣")
    .addStringOption(option =>
      option.setName("city").setDescription("輸入城市名稱").setRequired(true)
    ),
  async execute(interaction) {
    const city = interaction.options.getString("city");
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER}`
      );
      const temp = (res.data.main.temp - 273.15).toFixed(1);
      interaction.reply(`🌦 ${city} 天氣\n溫度: ${temp}°C\n狀態: ${res.data.weather[0].description}`);
    } catch (err) {
      interaction.reply("查無此城市或 API 錯誤");
    }
  }
};
