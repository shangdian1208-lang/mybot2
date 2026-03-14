const { SlashCommandBuilder } = require("discord.js");
const db = require("../utils/database");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rps")
    .setDescription("剪刀石頭布遊戲")
    .addStringOption(opt => opt.setName("choice").setDescription("你的選擇: rock/paper/scissors").setRequired(true)),
  async execute(interaction) {
    const choice = interaction.options.getString("choice").toLowerCase();
    const options = ["rock","paper","scissors"];
    if (!options.includes(choice)) return interaction.reply("❌ 選擇錯誤！");
    const botChoice = options[Math.floor(Math.random()*3)];
    let result;
    if (choice === botChoice) result = "平手！";
    else if ((choice==="rock"&&botChoice==="scissors")||(choice==="scissors"&&botChoice==="paper")||(choice==="paper"&&botChoice==="rock")) result="你贏了！";
    else result="你輸了！";
    interaction.reply(`你: ${choice}\nBot: ${botChoice}\n結果: ${result}`);
  }
};
