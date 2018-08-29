/**
 * @fileoverview Local storage manager, that stores 
 * data in localStorage
 *
 * @author Igor Yanishevskiy <igor@braindrain.pro>
 */
export default class LocalStorage {
    /**
     * Gets proxy locations
     * @return {Promise<ProxyItem[]>} local cache of items
     */
    static locations() {
        console.debug('getting locations from cache');
        return browser.storage.sync.get('proxies');
    }

    /**
     * Sets proxy locations
     * @param {ProxyItem[]} proxies proxy list to save
     * @return {Promise<any>} Promise with operation result
     */
    static locations(proxies) {
        console.debug('setting locations to cache');
        return browser.storage.sync.set({proxies: proxies});
    }

    /**
     * Gets currently user selected proxy
     * @return {Promise<ProxyItem>} local cache of items
     */
    static selectedLocation() {
        return browser.storage.sync.get('selectedProxy');
    }

    /**
     * Sets user selected proxy
     * @param {ProxyItem} proxy user selected proxy
     * @return {Promise<any>} Promise with operation result
     */
    static selectedLocation(proxy) {
        return browser.storage.sync.set({selectedProxy: proxy});
    }
}
