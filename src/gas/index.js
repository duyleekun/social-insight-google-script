import { getGmailAliases as $getGmailAliases, getGmailLabels as $getGmailLabels } from './gmail';
import { sendmail as $sendMail } from './server/mail';
import { doGet as $doGet } from './server/webapp';
import { writeFacebookPagesInsights as $writeFacebookPagesInsights } from './sheet/fb_page_insight';
import { writeFacebookVideosWithLifetimeInsights as $writeFacebookVideosWithLifetimeInsights } from './sheet/fb_video';
import { writeFacebookReelsWithLifetimeInsights as $writeFacebookReelsWithLifetimeInsights } from './sheet/fb_reel';

const global = this;
global.sendmail = $sendMail;

global.doGet = $doGet;

global.getGmailLabels = $getGmailLabels;
global.getGmailAliases = $getGmailAliases;
global.writeFacebookPagesInsights = $writeFacebookPagesInsights;
global.writeFacebookVideosWithLifetimeInsights = $writeFacebookVideosWithLifetimeInsights;
global.writeFacebookReelsWithLifetimeInsights = $writeFacebookReelsWithLifetimeInsights;

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
