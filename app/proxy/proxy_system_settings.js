
/**
 * Sets given proxy as proxy used by the browser
 * @param {ProxyItem} proxy proxy to set as browser proxy
 */
export function setProxy(proxy) {
    if (browser.proxy.settings.constructor.name === 'ChromeSetting') {
        setProxyChrome(proxy);
    } else setProxyWebextenstion(proxy);
}


/**
 * Compat function for Chrome browser
 *
 * @param {ProxyItem} proxy proxy to set as chromium proxy
 */
function setProxyChrome(proxy) {    
    let proxySettings = proxy ? {
        mode: 'fixed_servers',
        rules: {
            singleProxy: {
                host: proxy.ip,
                port: proxy.port,
            },
        },
    } : {
        mode: 'system',
    };
    console.debug('setting chrome proxy');
    browser.proxy.settings.set(
        {value: proxySettings,
            scope: 'regular'},
        console.log);
}

/**
 * Compat function for browsers compatible with
 * webextension standarts
 *
 * @param {*} proxy
 * @return {Promise<any>} result of setting
 * new proxy settings
 */
function setProxyWebextenstion(proxy) {
    let proxySettings = proxy ? {
        proxyType: 'manual',
        http: `http://${proxy.ip}:${proxy.port}`,
        httpProxyAll: true,
    } : {proxyType: 'system'};
    console.debug('setting webextension proxy');
    return browser.proxy.settings.set({value: proxySettings});
}
