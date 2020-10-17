/**
 * @file Manager that caches settings from
 * local storage to prefetch data into memory
 * and avoid using Promises
 *
 * This mostly needed as a hack for returning
 * user token immidiately for
 * {browser.webRequest.onBeforeSendHeaders} callback
 *
 * @author Igor Yanishevskiy <igor@braindrain.pro>
 */

import LocalStorage from './local_storage_manager';
import ProxyServerService from './proxy_server_service';

/* globals UserToken */
export default class PreferencesCache {
  /** @type {UserToken} */ userToken;

  /**
   * Gets instance of StorageCache (singleton)
   *
   * @memberof PreferencesCache
   * @returns {PreferencesCache} instance of storage
   */
  static get i() {
    if (!this._instance) {
      this._instance = new PreferencesCache();
    }
    return this._instance;
  }

  preload() {
    LocalStorage.userToken().then((token) => {
      if (token) return token;
      else return ProxyServerService.i().getUserToken();
    }).then((token) => this.userToken = token);
  }
}
