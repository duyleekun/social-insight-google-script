export function writeToSheet(sheetName, data: any[]) {
    const headers: string[] = Object.keys(data[0]);
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
        spreadSheet.setNamedRange(`${sheetName}.${headers[col]}`, sheet.getRange(2, parseInt(col) + 1, sheetData.length - 1, 1))
    }
}
