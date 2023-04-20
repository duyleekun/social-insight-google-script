import { getGmailAliases as localGetGmailAliases, getGmailLabels as localGetGmailLabels } from './gmail';
import { sendmail as localSendMail } from './server/mail';
import { doGet as localDoGet } from './server/webapp';
import { writeFacebookPagesInsights as localWriteFacebookPagesInsights } from './sheet/fb_page_insight';
import { writeFacebookPostsWithLifetimeInsights as localWriteFacebookPostsWithLifetimeInsights } from './sheet/fb_video';

const global = this;
global.sendmail = localSendMail;

global.doGet = localDoGet;

global.getGmailLabels = localGetGmailLabels;
global.getGmailAliases = localGetGmailAliases;
global.writeFacebookPagesInsights = localWriteFacebookPagesInsights;
global.writeFacebookPostsWithLifetimeInsights = localWriteFacebookPostsWithLifetimeInsights;

global.clearAll = () => {
  console.log('HAHA')
  console.log('SpreadsheetApp.getActiveSpreadsheet().getNamedRanges()',SpreadsheetApp.getActiveSpreadsheet().getNamedRanges())
  SpreadsheetApp.getActiveSpreadsheet().getNamedRanges().map((nr)=> {
    console.log(nr)
    nr.remove()
  })
  console.log('HEHE')
  SpreadsheetApp.getActiveSpreadsheet().getSheets().map((sheet)=> sheet.clear())
}

global.showHelp = () => {
  Browser.msgBox('Develop Google Apps Script project $ly inside VS Code');
};
global.showCredits = () => {
  SpreadsheetApp.getActiveSpreadsheet().toast('Developed by @duyleekun');
};

global.onOpen = () => {
  try {
    SpreadsheetApp.getUi()
      .createMenu('Facebook Insight')
      .addItem('Show sidebar', 'showSidebar')
      .addItem('clearAll', 'clearAll')
      // .addItem('Help', 'showHelp')
      // .addSeparator()
      // .addItem('Credits', 'showCredits')
      .addToUi();
  } catch (f) {
    Logger.log(f.message);
  }
};

global.showSidebar = () => {
  const ui = HtmlService.createTemplateFromFile('vue_sidebar')
    .evaluate()
    .setTitle('Facebook Insight')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  SpreadsheetApp.getUi().showSidebar(ui);
};
