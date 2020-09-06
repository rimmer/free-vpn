// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * @fileoverview This file initializes the extension's popup by creating a
 * ProxyFormController object.
 *
 * @author Mike West <mkwst@google.com>
 */
import {app, h} from 'hyperapp';
import ProxyServerService from '../lib/proxy_server_service.js';

import {ProxyServerListView} from '../lib/proxy_server_list_view';

const state = {
  /** @type {ProxyItem[]} */
  proxies: [],
  selectedProxy: null,
};

const actions = {
  selectProxy: (selectedProxy) => {
    ProxyServerService.i().setSelected(selectedProxy);
  },
  subscribeUpdateLocations: () => async (state, actions) => {
    ProxyServerService.i().subscribeToLocations(actions.updateLocations);
  },
  updateLocations: (locations) =>
    (state) =>
      ({proxies: locations, selectedProxy: state.selectedProxy}),
};

const view = (state) => (
  <ProxyServerListView proxies={state.proxies} select={actions.selectProxy} />
);

const hyperapp = app(
    state,
    actions,
    view,
    document.body
);

hyperapp.subscribeUpdateLocations();
