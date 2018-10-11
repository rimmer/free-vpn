/**
 * @fileoverview Local storage manager, that stores
 * data in localStorage
 *
 * @author Igor Yanishevskiy <igor@braindrain.pro>
 */
export default class LocalStorage {
    /**
     * Gets/sets proxy locations
     * @param {ProxyItem[]} proxies proxy list to save
     * @return {Promise<any>} Promise with operation result
     */
    static locations(proxies) {
        if (proxies) {
            return browser.storage.local.set({proxies: proxies});
        } else return browser.storage.local.get('proxies');
    }

    /**
     * Gets/sets user selected proxy
     * @param {ProxyItem} proxy user selected proxy
     * @return {Promise<any>} Promise with operation result
     */
    static selectedLocation(proxy) {
        if (proxy) {
            return browser.storage.local.set({selectedProxy: proxy});
        } else return browser.storage.local.get('selectedProxy');
    }
}
