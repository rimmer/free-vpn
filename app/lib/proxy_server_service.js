/**
 * @file Here we implement ProxyServerListView, that renders
 * proxy server list.
 *
 * We user {@link ProxyServerService}, as data provider
 *
 * @author Igor Yanishevskiy <igor@braindrain.pro>
 */
/* globals ProxyItem */
/* globals UserToken */
import 'whatwg-fetch';
import LocalStorage from './local_storage_manager.js';
import {APP_UUID, API_ENDPOINT} from './data/constants';

/**
 * This is a data provider for the proxy
 * server-side API
 *
 * @exports
 * @class ProxyServerService
 */
export default class ProxyServerService {
    /**
     * @type {ProxyServerService}
     * @memberof ProxyServerService
     */
    static _instance;

    _endpointAddress;

    /**
     * Gets instance of ProxyServerService (singleton)
     *
     * @memberof ProxyServerService
     * @returns {ProxyServerService} instance of service
     */
    static i() {
      if (!this._instance) {
        this._instance = new ProxyServerService();
      }
      return this._instance;
    }

    /**
     * Get full list of locations
     *
     * Server uses pagination,
     * so optionaly you may pass current page and per page param
     *
     * By default, we are trying to load DEFAULT_PER_PAGE,
     * since we are not expecting to have lots of data here
     *
     * Must be called ONLY from background page
     *
     * @memberof ProxyServerService
     * @returns {ProxyItem[]} proxy locations
     */
    async fetchLocations() {
      /** @type {Response} */
      let response;
      try {
        response = await fetch(this._getEndpointUrl() + 'locations');
        if (!response.ok) throw new Error(response.statusText);
      } catch (e) {
        console.warn('Failed to fetch proxies. Falling back to cache');
        response = this._getCachedLocations();
      }
      if (response.ok) {
        /** @type {Array} */
        const results = await response.json();
        if (results.length > 0) { // we assume its never empty
          console.debug('Saving locations to cache');
          LocalStorage.locations(results);
        }
        return results;
      } else {
        console.warn('Failed to parse proxies. Falling back to cache');
        return response.results;
      }
    }

    /**
     * @callback locationsCallback
     * @param {ProxyItem[]} proxies list of updated proxies
     */
    /**
     * Subscribe to location updates
     * from local storage
     *
     * @param {locationsCallback} callback callback that
     * will be provided with locations
     * @memberof ProxyServerService
     * @returns {void}
     */
    subscribeToLocations(callback) {
      const listener = function(changes) {
        for (const key in changes) {
          if (key === 'proxies') {
            const storageChange = changes[key];

            callback(storageChange.newValue);
          }
        }
      };
      if (!browser.storage.onChanged.hasListener(listener)) {
        browser.storage.onChanged.addListener(listener);
        // also, lets on the first load populate
        // proxies from local cache since they are not loaded
        // yet
        this._getCachedLocations().then((proxies) => {
          if (proxies) callback(proxies.results);
        });
      }
    }

    /**
     * Returns cached version of #getLocations
     * formatted as it would be responce from server
     *
     * @returns {object} list of cached proxies
     * @memberof ProxyServerService
     */
    async _getCachedLocations() {
      const data = await LocalStorage.locations();
      // also using 'cache' variable
      // to indicate we are on cache
      return {results: data ? data : []};
    }

    /**
     * Sets currently user selected proxy
     *
     * @param {ProxyItem} proxy object to remember the selection
     * @memberof ProxyServerService
     * @returns {void}
     */
    setSelected(proxy) {
      LocalStorage.selectedLocation(proxy);
      // lest notify background that proxy had changed
      browser.runtime.sendMessage(
          {selectProxy: true, selectedProxy: proxy}
      );
      console.debug(proxy);
    }

    /**
     * Gets currently user selected proxy
     *
     * @memberof ProxyServerService
     * @returns {Promise<any>} with selected location
     */
    async getSelected() {
      return LocalStorage.selectedLocation();
    }

    /**
     * Gets user token from the storage
     * If token has expired, fetch the new one from
     * remote server
     *
     * @returns {Promise<UserToken>} object with a token
     */
    async getUserToken() {
      let token = await LocalStorage.userToken();
      console.debug('User token from local storage', token);
      if (!this._isUserTokenValid(token)) {
        console.debug('User token invalid, getting new');
        token = await this._fetchUserToken();
        console.debug('Recieved new token', token);
        LocalStorage.userToken(token);
      }

      return Promise.resolve(token);
    }

    /**
     * @returns {UserToken} user token from network
     */
    async _fetchUserToken() {
      const url = this._getEndpointUrl() + 'tokens';

      /** @type {Request} */const request = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          app_uuid: APP_UUID,
          user_email: 'huyak@mail.ru',
        }),
      };
      return (await fetch(url, request)).json();
    }

    /**
     * Whether user token is valid
     *
     * @param {UserToken} userToken user token
     * @returns {boolean} whether user token is valid
     */
    _isUserTokenValid(userToken) {
      if (!userToken || !userToken.valid) return false;
      const expire = new Date(userToken.expire_at);
      return expire.getTime() > new Date().getTime();
    }

    /**
     * Get server endpoint from
     * enviroment variables (using .dontenv on dev)
     *
     * @returns {string} endpoint address url
     * @memberof ProxyServerService
     */
    _getEndpointUrl() {
      if (!this._endpointAddress) {
        this._endpointAddress = API_ENDPOINT.toString();
      }

      return this._endpointAddress;
    }
}
