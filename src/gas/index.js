import { getGmailAliases, getGmailLabels } from './gmail';
import { sendmail } from './server/mail';
import { doGet } from './server/webapp';
import { writeFacebookPagesInsights } from './sidebar';
global.sendmail = sendmail;

global.doGet = doGet;

global.getGmailLabels = getGmailLabels;
global.getGmailAliases = getGmailAliases;
global.writeFacebookPagesInsights = writeFacebookPagesInsights;

global.showHelp = () => {
  Browser.msgBox('Develop Google Apps Script project locally inside VS Code');
};
global.showCredits = () => {
  SpreadsheetApp.getActiveSpreadsheet().toast('Developed by Amit Agarwal @labnol');
};

global.onOpen = () => {
  try {
    SpreadsheetApp.getUi()
      .createMenu("Facebook Insight")
      .addItem('Show sidebar', 'showSidebar')
      // .addItem('Help', 'showHelp')
      // .addSeparator()
      // .addItem('Credits', 'showCredits')
      .addToUi();
  } catch (f) {
    Logger.log(f.message);
  }
};

global.showSidebar = () => {
  const ui = HtmlService.createTemplateFromFile('gas_sidebar')
    .evaluate()
    .setTitle('Facebook Insight')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  SpreadsheetApp.getUi().showSidebar(ui);
};
