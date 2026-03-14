const { SlashCommandBuilder } = require("discord.js");
const db = require("../utils/database");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gacha")
    .setDescription("扭蛋抽獎"),
  async execute(interaction) {
    const data = db.readDB();
    const id = interaction.user.id;
    if (!data.users[id]) data.users[id]={money:100,level:1,xp:0};
    if (data.users[id].money < 30) return interaction.reply("❌ 你沒有足夠金幣！");
    const amount = Math.floor(Math.random()*201)-100; // -100~100
    data.users[id].money += amount-30;
    db.writeDB(data);
    interaction.reply(`抽獎結果: ${amount}💰 (扣除30金幣費用)\n目前金幣: ${data.users[id].money}`);
  }
};
