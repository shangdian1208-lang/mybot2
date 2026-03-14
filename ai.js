const { SlashCommandBuilder } = require("discord.js");
const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ai")
    .setDescription("與 AI 聊天")
    .addStringOption(option =>
      option.setName("message").setDescription("你想說的話").setRequired(true)
    ),
  async execute(interaction) {
    const msg = interaction.options.getString("message");
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: msg }]
      });
      interaction.reply(response.choices[0].message.content);
    } catch (err) {
      interaction.reply("AI 回覆失敗");
    }
  }
};
