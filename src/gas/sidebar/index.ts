/**
 * Opens a sidebar. The sidebar structure is described in the Sidebar.html
 * project file.
 */

function writeToSheet(sheetName, data) {
  const headers = ['Date', 'Page ID','Page Name', 'Metric', 'Value'];
  const sheetData = [headers];
  for (const insight of data) {
    const row = [insight.date, insight.page_id, insight.page_name, insight.metric_type, insight.value];
    sheetData.push(row);
  }
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(sheetName);
  }
  sheet.clearContents();
  sheet.getRange(1, 1, sheetData.length, sheetData[0].length).setValues(sheetData);
}

function fetchJson(url, accessToken) {
  const response = UrlFetchApp.fetch(url, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    muteHttpExceptions: false,
  });
  const json = response.getContentText();
  const data = JSON.parse(json);
  return data

}
export function writeFacebookPagesInsights(facebookAccount, metrics, period='day', date_preset='last_90d') {
  console.log('writeFacebookPagesInsights',arguments)
  const insightsData = [];
  const accessToken = facebookAccount.access_token;
  let data : FacebookDataResponse<any>
  let url = `https://graph.facebook.com/v16.0/${facebookAccount.id}/insights?metric=${metrics.join(',')}&period=${period}&date_preset=${date_preset}`
  let page = 0
  do {
    console.log(facebookAccount.name,'page',++page)
    data = fetchJson(url,accessToken)
    // console.log(data);
    for (const metric of data.data) {
      // console.log(metric)
      for (const value of metric.values) {
        // console.log(value)
        const insight = {
          date: value.end_time.substring(0, 10),
          metric_type: metric.name,
          page_id: facebookAccount.id,
          page_name: facebookAccount.name,
          value: value.value,
        };
        insightsData.push(insight);
      }
    }
    url = data && data.paging && data.paging.next
  } while (url)

  // console.log(insightsData);
  writeToSheet(facebookAccount.name, insightsData);
}
