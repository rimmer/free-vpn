
/**
 * Sets given proxy as proxy used by chromium
 * @param {ProxyItem} proxy proxy to set as chromium proxy
 */
export function setProxy(proxy) {
    let proxySettings = {
        proxyType: 'manual',
        http: `http://${proxy.ip}}:${proxy.port}`,
        httpProxyAll: true,
    };

    browser.proxy.settings.set({value: proxySettings});
}
