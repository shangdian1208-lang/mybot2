const { SlashCommandBuilder } = require("discord.js");
const db = require("../utils/database");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("領取每日獎勵"),
  async execute(interaction) {
    const data = db.readDB();
    const id = interaction.user.id;
    if (!data.users[id]) data.users[id] = { money: 100, xp: 0, level: 1, lastDaily: 0 };
    const now = Date.now();
    if (now - (data.users[id].lastDaily || 0) < 24 * 60 * 60 * 1000) {
      return interaction.reply("你今天已經領過了，明天再來！");
    }
    data.users[id].money += 100;
    data.users[id].lastDaily = now;
    db.writeDB(data);
    interaction.reply("已領取每日 100 金幣！");
  }
};
