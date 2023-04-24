export function writeToSheet(sheetName, data: any[]) {
    toastMessage("Before write", sheetName, data.length);

    const headersSet = new Set<string>()

    let spreadSheet = SpreadsheetApp.getActiveSpreadsheet()
    let sheet = spreadSheet.getSheetByName(sheetName);
    if (!sheet) {
        sheet = spreadSheet.insertSheet(sheetName);
    }
    sheet.clearContents();
    sheet.clear()

    if (data.length == 0) {
        return
    }

    //Sampling header from top 10
    for (let i = 0; i < data.length; i++) {
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

    const range = sheet.getRange(1, 1, sheetData.length, sheetData[0].length)
    console.log('before range.getFilter()?.remove()')
    range.getFilter()?.remove()
    console.log('before range.setValues(sheetData)')
    range.setValues(sheetData);
    console.log('before range.createFilter()')
    range.createFilter();
    console.log('end range.createFilter()')
    toastMessage("Write finished", sheetName, data.length);
    // for (const col in headers) {
    //     console.log('${sheetName}.${headers[col]}', `${sheetName}.${headers[col]}`)
    //     console.log('headers[col].split(\'.\').length <= 1', headers[col].split('.').length <= 1)
    //     if (headers[col].split('.').length <= 1) {
    //         try {
    //             // spreadSheet.setNamedRange(`${sheetName}.${headers[col]}`, sheet.getRange(2, parseInt(col) + 1, sheetData.length - 1, 1))
    //         } catch (e) {
    //             console.error(e)
    //         }
    //     }
    // }
}

export function toastMessage(...messages) {
    SpreadsheetApp.getActive().toast(messages.join(" "));
}
