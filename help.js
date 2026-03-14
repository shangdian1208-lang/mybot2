const { SlashCommandBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder().setName("help").setDescription("顯示所有指令"),
  async execute(interaction) {
    const text = `
/help - 顯示指令
/ping - 測試延遲
/profile - 個人資料
/daily - 領每日金幣
/leaderboard - 排行榜
/weather - 天氣
/ai - AI聊天
/rps - 剪刀石頭布
/gacha - 扭蛋
/join - 語音加入
/play - 播放音樂
/skip - 跳過音樂
/leave - 離開語音
/create-role-panel - 身分組按鈕
/set-log-channel - 設置日誌頻道
/set-weather-channel - 設置天氣頻道
/set-ai-channel - 設置AI聊天頻道
/set-meme-channel - 設置梗圖頻道
/set-roblox-channel - 設置Roblox更新頻道
    `;
    interaction.reply(text);
  }
};
