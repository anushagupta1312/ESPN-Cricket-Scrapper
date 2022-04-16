const url = 'https://www.espncricinfo.com/series/ipl-2020-21-1210595'

const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')

let iplPath = path.join(__dirname, "IPL")
dirCreator(iplPath)

const allMatchObj = require('./AllMatch')

request(url, cb)

function cb(error, response, html){
    if(error){
        console.log(error)
    }
    else{
        extract(html)
    }
}

function extract(html){
    let $ = cheerio.load(html)
    let linkattr = $('a[data-hover="View All Results"]')
    let link = linkattr.attr('href')

    let fulllink = 'https://www.espncricinfo.com' + link
    // console.log(fulllink)

    allMatchObj.getAllMatch(fulllink)
}

function iplPath(filepath){
    if(fs.existsSync(filepath) == false){
        fs.mkdirSync(filepath)
    }
}

    
