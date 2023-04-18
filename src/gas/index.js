import { getGmailAliases as localGetGmailAliases, getGmailLabels as localGetGmailLabels } from './gmail';
import { sendmail as localSendMail } from './server/mail';
import { doGet as localDoGet } from './server/webapp';
import { writeFacebookPagesInsights as localWriteFacebookPagesInsights } from './sheet/fb_page';
import { writeFacebookPostsWithLifetimeInsights as localWriteFacebookPostsWithLifetimeInsights } from './sheet/fb_video';

const global = this;
global.sendmail = localSendMail;

global.doGet = localDoGet;

global.getGmailLabels = localGetGmailLabels;
global.getGmailAliases = localGetGmailAliases;
global.writeFacebookPagesInsights = localWriteFacebookPagesInsights;
global.writeFacebookPostsWithLifetimeInsights = localWriteFacebookPostsWithLifetimeInsights;


global.showHelp = () => {
  Browser.msgBox('Develop Google Apps Script project locally inside VS Code');
};
global.showCredits = () => {
  SpreadsheetApp.getActiveSpreadsheet().toast('Developed by Amit Agarwal @labnol');
};

global.onOpen = () => {
  try {
    SpreadsheetApp.getUi()
      .createMenu('Facebook Insight')
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
  const ui = HtmlService.createTemplateFromFile('vue_sidebar')
    .evaluate()
    .setTitle('Facebook Insight')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  SpreadsheetApp.getUi().showSidebar(ui);
};
