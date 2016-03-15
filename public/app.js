import moment from 'moment';
import chrome from 'ui/chrome';
import uiModules from 'ui/modules';
import $ from 'jquery';

import 'ui/autoload/styles';
import './app.less';

chrome
  .setNavBackground('#222222')
  .setTabs([])
  .setRootTemplate(`
    <iframe id="sitePluginIframe" src="${chrome.getInjected('sitePluginUrl')}"></iframe>
`);
