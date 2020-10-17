/**
 * @file Here we implement ProxyServerListView, that renders
 * proxy server list.
 *
 * We user {@link ProxyServerService}, as data provider
 *
 * @author Igor Yanishevskiy <igor@braindrain.pro>
 */

import {h} from 'hyperapp';

/**
 * Hyperapp render function,
 * Renders list of proxy servers,
 * that the user is eligible to select.
 *
 * @param {any} proxies list of proxies to display
 * @param {any} select callback to call when proxy is selected
 * @returns {object} object with hyperapp virtual DOM
 */
export const ProxyServerListView = ({proxies, select}) => (
  <ul class="list proxies">
    <li class="pseudo button"
      onclick={()=>select(null)}>
      {browser.i18n.getMessage('directConnection')}
    </li>
    {proxies && proxies.map((server) => (
      <li class="pseudo button"
        onclick={()=>select(server)}>
        <span class={
          'flag-icon flag-icon-'+server.country.toLowerCase()
        }/>
        {server.city}
      </li>
    ))}
  </ul>
);
