import PreferencesCache from "./preferences_cache";
import { ACCESS_TOKEN, API_ENDPOINT } from './data/constants';

/**
 * Sets given proxy as proxy used by the browser
 * @param {ProxyItem} proxy proxy to set as browser proxy
 */
export function setProxy(proxy) {
  PreferencesCache.i.isCustomProxySet = proxy ? true : false;

  if (isChrome()) setProxyChrome(proxy);
  else setProxyWebextenstion(proxy);
}

export async function getProxy() {
  if (isChrome())
    return new Promise((resolve) => 
      chrome.proxy.settings.get({}, (data) => resolve(data))
    );
  else return browser.proxy.settings.get();
}

/**
 * Returns if we are running at Chrome.
 *
 * @returns {boolean} if running on Chrome
 */
export function isChrome() {
  return !!window.chrome
    && (!!window.chrome.webstore || !!window.chrome.runtime);
}

export function startHeaderInterception() {
  browser.webRequest.onAuthRequired.addListener(
    _headersInterceptor,
    { urls: ['<all_urls>'] },
    ['blocking'],
  );
}

export function stopHeaderInterception() {
  browser.webRequest.onAuthRequired.removeListener(_headersInterceptor);
}

/**
 * onAuthRequired callback
 *
 * @param {browser.webRequest._OnBeforeSendHeadersDetails} details of the request
 * @returns {browser.webRequest.BlockingResponse} 
 * returns proxy auth credentials
 */
function _headersInterceptor(details) {
  if (details.tabId == -1) return {};
  console.debug("Intercepting ", details);
  
  const token = PreferencesCache.i.userToken;

  console.debug("StorageCache returned token", token);
  
  return {
    authCredentials: {
      username: token.token,
      password: ACCESS_TOKEN
    }
  };  
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
      bypassList: [
        API_ENDPOINT.host,
        '<local>'
      ]
    },
  } : {
      mode: 'system',
    };
  console.debug('setting chrome proxy');
  browser.proxy.settings.set(
    {
      value: proxySettings,
      scope: 'regular',
    }
  );
}

/**
 * Compat function for browsers compatible with
 * webextension standarts
 *
 * @param {any} proxy
 * @returns {Promise<any>} result of setting
 * new proxy settings
 */
function setProxyWebextenstion(proxy) {
  const proxySettings = proxy ? {
    proxyType: 'manual',
    http: `http://${proxy.ip}:${proxy.port}`,
    httpProxyAll: true,
    passthrough: [
      API_ENDPOINT.host,
      'localhost',
      '127.0.0.1'
    ]
  } : { proxyType: 'system' };
  console.debug('setting webextension proxy');
  return browser.proxy.settings.set({ value: proxySettings });
}
