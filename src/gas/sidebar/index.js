/**
 * Opens a sidebar. The sidebar structure is described in the Sidebar.html
 * project file.
 */

function getPageInfo(accessToken) {
  const url = `https://graph.facebook.com/me/accounts?fields=id,name,access_token,perms&access_token=${accessToken}`;

  const response = UrlFetchApp.fetch(url);
  const data = JSON.parse(response.getContentText());

  const pages = data.data;
  const pageInfo = [];

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const pageId = page.id;
    const pageAccessToken = page.access_token;

    // Check if you have the 'Page Insights' permission
    if (page.perms.includes('READ_INSIGHTS')) {
      // Get the page's username
      const usernameUrl = `https://graph.facebook.com/${pageId}?fields=username&access_token=${pageAccessToken}`;
      const usernameResponse = UrlFetchApp.fetch(usernameUrl);
      const usernameData = JSON.parse(usernameResponse.getContentText());
      const { username } = usernameData;

      // Store the page's username and access token in an object
      const pageObject = {
        username,
        accessToken: pageAccessToken,
      };
      pageInfo.push(pageObject);
    }
  }

  return pageInfo;
}

function getPageAccessToken(pageID, personalAccessToken) {
  const url = `https://graph.facebook.com/v16.0/${pageID}?fields=access_token&access_token=${personalAccessToken}`;
  console.log(url);
  const response = UrlFetchApp.fetch(url);
  const json = response.getContentText();
  const data = JSON.parse(json);
  console.log(data);
  return data.access_token;
}

function writeToSheet(data) {
  const sheetName = 'Facebook Insights'; // Replace with your desired sheet name
  const headers = ['Date', 'Page ID', 'Metric', 'Value'];
  const sheetData = [headers];
  for (const insight of data) {
    const row = [insight.date, insight.page_id, insight.metric_type, insight.value];
    sheetData.push(row);
  }
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(sheetName);
  }
  sheet.clearContents();
  sheet.getRange(1, 1, sheetData.length, sheetData[0].length).setValues(sheetData);
}

export function writeFacebookPagesInsights(facebookAccounts, metrics, period='day', date_preset='this_year') {
  // let personalAccessToken = "EAAET9IYdZBtYBAI6pWGIgD6ARJDEA7L7cBVfstg5afuNzGfe9lEZASoMc7DpkH0MU4Hy1Apufvlppf8lxEfvAQBeE2fiDgdPJu5pY2daSblPufDit1JzBarHrXDytqSRQF4amukS6gAs91ohQF5UqKnCMcayGrkDcjArEqLf4oWsxGtQFd4VoSTjGVovtZBBX56ZCTP2ba3dq7K1NRYdZCDsHKXYlMJ0ZD"; // Replace with your Facebook access token
  const insightsData = [];
  for (let i = 0; i < facebookAccounts.length; i++) {
    const accessToken = facebookAccounts[i].accessToken;
    const url = `https://graph.facebook.com/v16.0/${facebookAccounts[i].accessToken}/insights?metric=${metrics.join(
      ','
    )}&period=${period}&date_preset=${date_preset}`
    const options = {
      method: 'get',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      muteHttpExceptions: true,
    };
    const response = UrlFetchApp.fetch(url, options);
    const json = response.getContentText();
    const data = JSON.parse(json);
    console.log(data);
    for (const metric of data.data) {
      // console.log(metric)
      for (const value of metric.values) {
        // console.log(value)
        const insight = {
          date: value.end_time.substr(0, 10),
          metric_type: metric.name,
          page_id: pageIDs[i],
          value: value.value,
        };
        insightsData.push(insight);
      }
    }
  }
  console.log(insightsData);
  writeToSheet(insightsData);
}
