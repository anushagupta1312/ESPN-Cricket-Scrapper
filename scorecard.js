//const url = 'https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard'

const request = require('request')
const cheerio = require('cheerio')
const path = require("path");
const fs = require("fs");

const xlsx = require('xlsx')

function processScoreCard(url) {
    request(url, cb)
}


function cb(err, response, html) {
    if (err) {
        console.log(err)
    }
    else {
        extractScoreCardHtml(html)
    }
}

let venue
let date
let result
function extractScoreCardHtml(html) {
    let $ = cheerio.load(html)
    let descElem = $('.header-info .description').text()
    // console.log(descElem.text())
    let descArr = descElem.split(',')
    //jab bhi split func use krna h to trim() use krna h to remove extra spaces

    venue = descArr[1].trim()
    date = descArr[2].trim()

    result = $('.match-info.match-info-MATCH.match-info-MATCH-half-width .status-text span').text()
    // console.log(descArr)

    // console.log(venue)
    // console.log(date)
    // console.log(result)

    getTableHtml(html)

}

function getTableHtml(html) {
    let $ = cheerio.load(html)
    let tableArr = $('.card.content-block.match-scorecard-table>.Collapsible')

    let tableHtml = ""
    for (let i = 0; i < tableArr.length; i++) {
        tableHtml += $(tableArr[i]).html()

        let teamName = $(tableArr[i]).find('h5').text()
        teamName = teamName.split('INNINGS')[0]
        let opponentIndex = (i == 0) ? 1 : 0

        let opponentName = $(tableArr[opponentIndex]).find('h5').text()
        opponentName = opponentName.split('INNINGS')[0]

        // console.log(teamName)
        // console.log(teamName, opponentName, venue, date, result)

        let cInning = $(tableArr[i])
        let allRows = cInning.find('.table.batsman tbody tr')

        for (let j = 0; j < allRows.length; j++) {
            let allCols = $(allRows[j]).find('td')
            let isWorthy = $(allCols[0]).hasClass('batsman-cell')

            if (isWorthy) {
                let playerName = $(allCols[0]).text().trim();
                let runs = $(allCols[2]).text().trim();
                let balls = $(allCols[3]).text().trim();
                let fours = $(allCols[5]).text().trim();
                let sixes = $(allCols[6]).text().trim();
                let STR = $(allCols[7]).text().trim();

                console.log(
                    `${playerName} | ${runs} | ${balls} | ${fours} | ${sixes} | ${STR}`
                );

                processPlayer(
                    teamName,
                    opponentName,
                    playerName,
                    runs,
                    balls,
                    fours,
                    sixes,
                    STR,
                    venue,
                    date,
                    result
                );
            }


        }

        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    }


    // console.log(tableHtml)
}

function processPlayer(
    teamName,
    opponentName,
    playerName,
    runs,
    balls,
    fours,
    sixes,
    STR,
    venue,
    date,
    result
) {
    let teamPath = path.join(__dirname, "IPL", teamName);
    dirCreator(teamPath);

    let filePath = path.join(teamPath, playerName + ".xlsx");

    let content = excelReader(filePath, playerName);[]

    let playerObj = {
        playerName,
        teamName,
        opponentName,
        runs,
        balls,
        fours,
        sixes,
        STR,
        venue,
        date,
        result,
    };

    content.push(playerObj)

    excelWriter(filePath, playerName, content)
}

function dirCreator(folderPath) {
    if (fs.existsSync(folderPath) == false) {
        fs.mkdirSync(folderPath);
    }
}

function excelWriter(fileName, sheetName, jsonData) {
    let newWB = xlsx.utils.book_new();
    // Creating a new WorkBook
    let newWS = xlsx.utils.json_to_sheet(jsonData);
    // Json is converted to sheet format (rows and cols)
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    xlsx.writeFile(newWB, fileName);
}

function excelReader(fileName, sheetName) {
    if (fs.existsSync(fileName) == false) {
        return [];
    }
    let wb = xlsx.readFile(fileName);

    let excelData = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans
}



module.exports = {
    ps: processScoreCard
}