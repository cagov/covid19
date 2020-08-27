const fs = require('fs');

let json = JSON.parse(fs.readFileSync('./tiers.json'))

console.log(json[0])

let updates = []
json.forEach(item => {
  updates.push({"county":item.county,"Overall Status":(5 - parseInt(item.status)).toString()})
})
console.log(updates[0])
fs.writeFileSync('./countyStatus.json',JSON.stringify(updates),'utf8')