const {SlashCommandBuilder}=require("discord.js")
const db=require("../database.json")

module.exports={

data:new SlashCommandBuilder()
.setName("leaderboard")
.setDescription("查看金錢排行榜"),

async execute(interaction){

const users=Object.entries(db.users)

.sort((a,b)=>b[1].money-a[1].money)

.slice(0,10)

let text="🏆 金錢排行榜\n"

users.forEach((u,i)=>{

 text+=`${i+1}. <@${u[0]}> ${u[1].money}💰\n`

})

interaction.reply(text)

}

}