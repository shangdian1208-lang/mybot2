const fs = require("fs");
const path = "./database.json";

function readDB() {
  return JSON.parse(fs.readFileSync(path));
}
function writeDB(data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}
module.exports = { readDB, writeDB };
