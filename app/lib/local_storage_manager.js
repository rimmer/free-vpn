/**
 * @file Local storage manager, that stores
 * data in localStorage
 *
 * @author Igor Yanishevskiy <igor@braindrain.pro>
 */
export default class LocalStorage {
  /**
   * Gets/sets proxy locations
   *
   * @param {ProxyItem[]} proxies proxy list to save
   * @returns {boolean | Promise<ProxyItem[]>} true if setting proxies
   * was successful
   * or Promise with operation result
   */
  static async locations(proxies) {
    if (proxies) {
      const result = await browser.storage.local.set({proxies: proxies});
      return (result === undefined); // means everything went good
    } else {
      const result = await browser.storage.local.get('proxies');
      return result.proxies;
    }
  }

  /**
   * Gets/sets user selected proxy
   *
   * @param {ProxyItem} proxy user selected proxy
   * @returns {Promise<ProxyItem> | Promise<any>} Promise with operation result
   */
  static selectedLocation(proxy) {
    if (proxy) {
      return browser.storage.local.set({selectedProxy: proxy});
    } else return browser.storage.local.get('selectedProxy');
  }

  /**
   * Gets/sets user user token
   *
   * @param {UserToken} newToken new user token to save
   * @returns {Promise<UserToken> | Promise<any>} promise with operation result
   */
  static async userToken(newToken) {
    if (newToken) {
      return browser.storage.local.set({userToken: newToken});
    } else {
      const result = await browser.storage.local.get('userToken');
      return result.userToken;
    };
  }
}
