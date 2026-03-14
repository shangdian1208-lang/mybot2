const { SlashCommandBuilder } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");
const db = require("../utils/database");

const configuration = new Configuration({ apiKey: process.env.OPENAI_KEY });
const openai = new OpenAIApi(configuration);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ai")
    .setDescription("與 AI 聊天")
    .addStringOption(opt => opt.setName("message").setDescription("聊天內容").setRequired(true)),
  async execute(interaction) {
    const data = db.readDB();
    if (!data.settings || !data.settings.aiChannel || interaction.channel.id !== data.settings.aiChannel)
      return interaction.reply("❌ 這個頻道不能使用 AI 指令！");
    const msg = interaction.options.getString("message");
    const res = await openai.createChatCompletion({
      model:"gpt-3.5-turbo",
      messages:[{role:"user",content:msg}]
    });
    interaction.reply(res.data.choices[0].message.content);
  }
};
