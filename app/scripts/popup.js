// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * @fileoverview This file initializes the extension's popup by creating a
 * ProxyFormController object.
 *
 * @author Mike West <mkwst@google.com>
 */

import {app} from 'hyperapp';
import {
    ProxyServerListState,
    ProxyServerListActions,
    ProxyServerListView,
} from '../proxy/proxy_server_list_view';

const hyperapp = app(
    ProxyServerListState,
    ProxyServerListActions,
    ProxyServerListView,
    document.body
);

hyperapp.startUpdateLocations();
