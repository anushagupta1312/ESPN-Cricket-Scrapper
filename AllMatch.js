const request = require('request')
const cheerio = require('cheerio')

const scoreObj = require('./scorecard')

function getScoreCards(link) {
    request(link, cb)

    function cb(err, response, html) {
        if (err) {
            console.log(err)
        }
        else {
            getScoreCardsHtml(html)
        }
    }
    function getScoreCardsHtml(html) {
        let $ = cheerio.load(html)
        let scoreCards = $('a[data-hover="Scorecard"]')
        for (let i = 0; i < scoreCards.length; i++) {
            let scoreCardLink = $(scoreCards[i]).attr('href')
            let fullScoreLink = `https://www.espncricinfo.com${scoreCardLink}`
            //console.log(fullScoreLink)
            scoreObj.ps(fullScoreLink)
        }
    }
}

module.exports ={
    getAllMatch : getScoreCards
}
