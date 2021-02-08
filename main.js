const fs = require("fs");
const md5 = require("md5");

function hashStringToInt32(str) {
  let hash = 0,
    i,
    chr;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (chr << 5) + hash - chr;
    // hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

// console.log(ice);
function start() {
  const result = {};
  const test = {};
  var XLSX = require("xlsx");
  var workbook = XLSX.readFile("name_query.csv");
  var sheet_name_list = workbook.SheetNames;
  var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

  for (const i in xlData) {
    const nameEn = xlData[i]["n.en"];
    if (typeof nameEn == "string") {
      const upperCase = xlData[i]["n.en"].toUpperCase();
      let id = hashStringToInt32(upperCase);
      let isLoop = true;
      let x = 0;
      while (isLoop) {
        if (!test[id]) {
          test[id] = upperCase;
          isLoop = false;
        } else {
          if (x != 0) {
            id = hashStringToInt32(md5(upperCase)) + (x << 5);
          } else {
            id = hashStringToInt32(md5(upperCase));
          }
          x += 1;
        }
      }

      result[upperCase] = id;
    }
  }

  const stream = fs.createWriteStream("./leagueMapping3.js");
  stream.once("open", function (fd) {
    const title = `
    const leagueId = `;
    stream.write(title + JSON.stringify(result));
    stream.end();
    console.log("Backup league success.");
  });
}

start();

//COLOMBIA TORNEO AGUILA

// DENMARK RESERVE LEAGUE
// const ice = hashStringToInt32("DENMARK RESERVE LEAGUE");
