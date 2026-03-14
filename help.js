const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("顯示所有指令"),
  async execute(interaction) {
    const helpText = `
**Slash 指令列表**
/help - 顯示指令
/ping - 測試延遲
/profile - 查看個人資料
/daily - 每日金幣
/leaderboard - 排行榜
/weather - 天氣
/ai - AI聊天
/set-log-channel - 設置日誌頻道
/set-weather-channel - 設置天氣頻道
/set-ai-channel - 設置AI聊天頻道
/join - 加入語音
/play - 播放音樂
/skip - 跳過音樂
/leave - 離開語音
/create-role-panel - 建立身分組按鈕
    `;
    interaction.reply(helpText);
  }
};
