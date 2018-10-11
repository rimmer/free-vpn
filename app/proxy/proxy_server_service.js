/**
 * @fileoverview Here we implement ProxyServerListView, that renders
 * proxy server list.
 *
 * We user {@link ProxyServerService}, as data provider
 *
 * @author Igor Yanishevskiy <igor@braindrain.pro>
 */
import 'whatwg-fetch';
import './data/proxy_item.js';
import LocalStorage from './local_storage_manager.js';

/**
 * This is a data provider for the proxy
 * server-side API
 *
 * @export
 * @class ProxyServerService
 */
export default class ProxyServerService {
    /**
     * @type {integer}
     * @memberof ProxyServerService
     */
    static _DEFAULT_PER_PAGE = 50;
    static _instance;

    _endpointAddress;

    /**
     * Gets instance of ProxyServerService (singleton)
     * @memberof ProxyServerService
     * @return {ProxyServerService} instance of service
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
     * @param {integer} page current page
     * @param {integer} perPage items per page.
     *                  @default _DEFAULT_PER_PAGE
     * @memberof ProxyServerService
     * @return {Promise<ProxyItem[]>} promise that will contain
     * proxy locattions plus pagination data
     */
    getLocations(page = 1,
                        perPage = ProxyServerService._DEFAULT_PER_PAGE) {
        return fetch(
                this._getEndpointUrl()
                + '/api/v1/locations?pages='
                + page + '&per_page='
                + perPage)
            .catch(() => {
                console.error('Failed to fetch proxies. Falling back to cache');
                // pretend the real data
                return this._getCachedLocations();
            })
            .then((response) => response.json())
            .catch(() => {
                console.error('Failed parse proxy list. Falling back to cache');
                // pretend the real data
                return this._getCachedLocations();
            })
            .then((results) => {
                let data = results.results;
                if (!results.cache) {
                    console.debug('Saving locations to cache');
                    LocalStorage.locations(data);
                }
                return data;
            });
    }

    /**
     * Returns cached version of #getLocations
     * formatted as it would be responce from server
     *
     * @return {Promise<object>} list of cached proxies
     * @memberof ProxyServerService
     */
    async _getCachedLocations() {
        const data = await LocalStorage.locations();
        return {
            json: () => {
                // also using 'cache' variable
                // to indicate we are on cache
                return {results: data ? data : [], cache: true};
            },
        };
    }

    /**
     *
     * Sets currently user selected proxy
     *
     * @param {ProxyItem} proxy
     * @memberof ProxyServerService
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
     * @memberof ProxyServerService
     */
    async getSelected() {
        return LocalStorage.selectedLocation();
    }

    /**
     * Get server endpoint from
     * enviroment variables (using .dontenv on dev)
     *
     * @return {string} endpoint address url
     * @memberof ProxyServerService
     */
    _getEndpointUrl() {
        if (!this._endpointAddress) {
            this._endpointAddress = 'http://185.177.4.227:8080';
        }

        return this._endpointAddress;
    }
}
