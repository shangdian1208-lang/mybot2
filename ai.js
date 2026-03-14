const {SlashCommandBuilder}=require("discord.js")
const OpenAI=require("openai")

const openai=new OpenAI({
 apiKey:process.env.OPENAI_KEY
})

module.exports={

data:new SlashCommandBuilder()
.setName("ai")
.setDescription("與AI聊天")
.addStringOption(o=>o.setName("訊息").setDescription("輸入內容").setRequired(true)),

async execute(interaction){

const msg=interaction.options.getString("訊息")

await interaction.deferReply()

const completion=await openai.chat.completions.create({

 model:"gpt-4o-mini",
 messages:[{role:"user",content:msg}]

})

interaction.editReply(completion.choices[0].message.content)

}

}

const {SlashCommandBuilder,PermissionFlagsBits}=require("discord.js")
const {loadDB,saveDB}=require("../utils/database")

module.exports={

data:new SlashCommandBuilder()
.setName("set-ai-channel")
.setDescription("設置AI聊天頻道")
.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

async execute(interaction){

const db=loadDB()

db.settings.aiChannel=interaction.channel.id

saveDB(db)

interaction.reply("AI聊天頻道已設置")

}

}