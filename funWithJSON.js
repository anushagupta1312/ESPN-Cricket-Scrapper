//xlsx important funxtions imported from npm module

let newWB = xlsx.utils.book_new();
let newWS = xlsx.utils.json_to_sheet(json);
xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
xlsx.writeFile(newWB, fileName);
//kisi json format ko kese excel sheet me write rkna h

let wb = xlsx.readFile(filePath);
let excelData = wb.Sheets[sheetName];
let ans = xlsx.utils.sheet_to_json(excelData);
console.log(ans)
