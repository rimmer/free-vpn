// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * @fileoverview This file initializes the background page by loading a
 * ProxyErrorHandler, and resetting proxy settings if required.
 *
 * @author Mike West <mkwst@google.com>
 */

import ProxyFormController from '../proxy/proxy_form_controller.js';
import ProxyErrorHandler from '../proxy/proxy_error_handler.js';

browser.runtime.onInstalled.addListener((details) => {
  console.log('previousVersion', details.previousVersion);
});

document.addEventListener('DOMContentLoaded', function() {
  new ProxyErrorHandler();

  // If this extension has already set the proxy settings, then reset it
  // once as the background page initializes.  This is essential, as
  // incognito settings are wiped on restart.
  let persistedSettings = ProxyFormController.getPersistedSettings();
  if (persistedSettings !== null) {
    chrome.proxy.settings.set(
        {'value': persistedSettings.regular});
  }
});
