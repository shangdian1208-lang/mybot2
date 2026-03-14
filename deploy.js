const {REST,Routes}=require("discord.js")
const fs=require("fs")

const commands=[]

const folders=["commands","admin","music"]

for(const folder of folders){

 const files=fs.readdirSync(`./${folder}`)

 for(const file of files){

  const cmd=require(`./${folder}/${file}`)
  commands.push(cmd.data.toJSON())

 }

}

const rest=new REST({version:"10"}).setToken(process.env.TOKEN)

async function deploy(){

 await rest.put(
  Routes.applicationCommands(process.env.CLIENT_ID),
  {body:commands}
 )

 console.log("Slash指令部署完成")

}

deploy()