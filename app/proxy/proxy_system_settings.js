
/**
 * Sets given proxy as proxy used by the browser
 * @param {ProxyItem} proxy proxy to set as browser proxy
 */
export function setProxy(proxy) {
  if (isChrome()) {
    setProxyChrome(proxy);
  } else setProxyWebextenstion(proxy);
}

/**
 * Returns if we are running at Chrome
 * @return {boolean} if running on Chrome
 */
export function isChrome() {
  return !!window.chrome
    && (!!window.chrome.webstore || !!window.chrome.runtime);
}

/**
 * Compat function for Chrome browser
 *
 * @param {ProxyItem} proxy proxy to set as chromium proxy
 */
function setProxyChrome(proxy) {
  const proxySettings = proxy ? {
    mode: 'fixed_servers',
    rules: {
      singleProxy: {
        host: proxy.ip,
        port: proxy.port,
      },
    },
  } : {
    mode: 'system',
  };
  console.debug('setting chrome proxy');
  browser.proxy.settings.set(
      {value: proxySettings,
        scope: 'regular'},
      console.log);
}

/**
 * Compat function for browsers compatible with
 * webextension standarts
 *
 * @param {*} proxy
 * @return {Promise<any>} result of setting
 * new proxy settings
 */
function setProxyWebextenstion(proxy) {
  const proxySettings = proxy ? {
    proxyType: 'manual',
    http: `http://${proxy.ip}:${proxy.port}`,
    httpProxyAll: true,
  } : {proxyType: 'system'};
  console.debug('setting webextension proxy');
  return browser.proxy.settings.set({value: proxySettings});
}
