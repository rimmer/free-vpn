// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * @fileoverview This file initializes the background page by loading a
 * ProxyErrorHandler, and resetting proxy settings if required.
 *
 * @author Mike West <mkwst@google.com>
 */

import {setProxy, startHeaderInterception, stopHeaderInterception} from '../lib/proxy_system_settings';
import ProxyServerService from '../lib/proxy_server_service.js';
import PreferencesCache from "../lib/preferences_cache";

PreferencesCache.i.preload();

browser.runtime.onInstalled.addListener((details) => {
  console.log('previousVersion', details.previousVersion);
});

document.addEventListener('DOMContentLoaded', function() {
  // If this extension has already set the proxy settings, then reset it
  // once as the background page initializes.  This is essential, as
  // incognito settings are wiped on restart.
  updateHeadersInterceptionStatus();
  browser.runtime.onMessage.addListener((request) => {
    if (request.selectProxy) {
      const proxy = request.selectedProxy;
      setProxy(proxy);
      updateHeadersInterceptionStatus();
    }
  });

  ProxyServerService.i().fetchLocations();
});

function updateHeadersInterceptionStatus() {
  if (PreferencesCache.i.isCustomProxySet) {
    startHeaderInterception();
  } else {
    stopHeaderInterception();
  }
}