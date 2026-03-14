const fs=require("fs")

function loadDB(){
 return JSON.parse(fs.readFileSync("database.json"))
}

function saveDB(db){
 fs.writeFileSync("database.json",JSON.stringify(db,null,2))
}

function getUser(db,id){

 if(!db.users[id]){

  db.users[id]={
   money:100,
   xp:0,
   level:1,
   lastDaily:0
  }

 }

 return db.users[id]

}

module.exports={loadDB,saveDB,getUser}