// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * @file This file initializes the background page by loading a
 * ProxyErrorHandler, and resetting proxy settings if required.
 *
 * @author Mike West <mkwst@google.com>
 */

import {proxyItemToProxySettings,
  startHeaderInterception,
  stopHeaderInterception} from '../lib/proxy_system_settings';
import ProxyServerService from '../lib/proxy_server_service.js';
import PreferencesCache from '../lib/preferences_cache';
import ToggleProxy from '../lib/ToggleProxy';

const toggleProxy = new ToggleProxy();

PreferencesCache.i.preload();

browser.runtime.onInstalled.addListener((details) => {
  console.log('previousVersion', details.previousVersion);
});

// proxy controllable insight listener
toggleProxy.onStatus((isProxyOn) => {
  if (isProxyOn) {
    startHeaderInterception();
  } else {
    stopHeaderInterception();
  }
});

// test proxy controllable
toggleProxy.testSettingControl();

document.addEventListener('DOMContentLoaded', function() {
  browser.runtime.onMessage.addListener((request) => {
    if (request.selectProxy) {
      const proxySettings = proxyItemToProxySettings(request.selectedProxy);
      // this also might trigger toggleProxy.onStatus
      toggleProxy.setProxySettings(proxySettings);
      request.selectedProxy ? toggleProxy.enable() : toggleProxy.disable();
    }
  });

  ProxyServerService.i().fetchLocations();
});
