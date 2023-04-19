export function writeToSheet(sheetName, data: any[]) {
    const headersSet = new Set<string>()

    //Sampling header from top 10
    for (let i = 0; i < 10; i++) {
        // console.log(Object.keys(data[0]))
        // console.log(data[0])
        if (data[i])
            Object.keys(data[i]).forEach(j => headersSet.add(j))
    }

    const headers: string[] = Array.from(headersSet)
    const sheetData = [headers];
    for (const datum of data) {
        if (datum)
            sheetData.push(headers.map((it) => datum[it]));
    }
    let spreadSheet = SpreadsheetApp.getActiveSpreadsheet()
    let sheet = spreadSheet.getSheetByName(sheetName);
    if (!sheet) {
        sheet = spreadSheet.insertSheet(sheetName);
    }
    sheet.clearContents();

    const range = sheet.getRange(1, 1, sheetData.length, sheetData[0].length)
    range.getFilter()?.remove()
    range.setValues(sheetData);
    range.createFilter();
    for (const col in headers) {
        console.log('named range', `${sheetName}.${headers[col]}`)
        if (headers[col].split('.').length <= 1) {
            spreadSheet.setNamedRange(`${sheetName}.${headers[col]}`, sheet.getRange(2, parseInt(col) + 1, sheetData.length - 1, 1))
        }
    }
}
