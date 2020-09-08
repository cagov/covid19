const fs = require('fs');

let oldjson = JSON.parse(fs.readFileSync('./tiers.json'))
let newjson = JSON.parse(fs.readFileSync('./newtiers.json'))

let updatedStatusCount = 0;
oldjson.forEach(item => {
  // console.log(item.county)
  newjson.forEach(newitem => {
    if(newitem.county === item.county) {
      console.log(item.county + ":" + newitem.county + " .. " + item.status + ":" + newitem.status)
      if(item.status != newitem.status) {
        updatedStatusCount++
      }
    }
  })
})

console.log('The number of updated county tiers in this batch is: '+updatedStatusCount)