import PreferencesCache from './preferences_cache';

import {ACCESS_TOKEN} from './data/constants';

/**
 * Convets proxy item to an object digestable by ToggleProxy
 *
 * @param {ProxyItem} proxy to convert into ToggleProxy settings
 * @returns {object} proxy settings
 */
export function proxyItemToProxySettings(proxy) {
  return {
    http: {
      active: true,
      host: proxy.ip,
      port: proxy.port,
    },
    ssl: {
      active: true,
      host: proxy.ip,
      port: proxy.port,
    },
  }
}

export function startHeaderInterception() {
  browser.webRequest.onAuthRequired.addListener(
      _headersInterceptor,
      {urls: ['<all_urls>']},
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
  console.debug('Intercepting ', details);

  const token = PreferencesCache.i.userToken;

  console.debug('StorageCache returned token', token);

  return {
    authCredentials: {
      username: token.token,
      password: ACCESS_TOKEN,
    },
  };
}
