/**
 * @fileoverview Here we implement ProxyServerListView, that renders
 * proxy server list.
 *
 * We user {@link ProxyServerService}, as data provider
 *
 * @author Igor Yanishevskiy <igor@braindrain.pro>
 */

import {h} from 'hyperapp';
import ProxyServerService from './proxy_server_service.js';

export const ProxyServerListState = {
    // TODO this should be replaced with tests
    /** @type {ProxyItem[]} */
    proxies: [],
    selectedProxy: ProxyServerService.i().getSelected(),
};

export const ProxyServerListActions = {
    select: (selectedProxy) => (state) => {
        state.selectedProxy = selectedProxy;
        ProxyServerService.i().setSelected(selectedProxy);
    },
    startUpdateLocations: () => async (state, actions) => {
        actions.updateLocations(await ProxyServerService.i().getLocations());
    },
    updateLocations: (locations) => ({proxies: locations}),
};

/**
 * Hyperapp render function,
 * Renders list of proxy servers,
 * that the user is eligible to select.
 *
 * @param {ProxyServerListState} state
 * @param {ProxyServerListActions} actions
 * @return {Object} object with hyperapp virtual DOM
 */
export const ProxyServerListView = (state, actions) => (
    <ul class="list proxies">
        {state.proxies.map((server) => (
            <li class="pseudo button"
                onclick={()=>actions.select(server)}>
                <span class={
                    'flag-icon flag-icon-'+server.country.toLowerCase()
                }/>
                {server.city}
            </li>
        ))}
    </ul>
);
