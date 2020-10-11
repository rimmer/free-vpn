// This file is not going through babel transformation.
// So, we write it in vanilla JS
// (But you could use ES2015 features supported by your Node.js version)

const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/**
 * Here we modify the original webpack config
 * This function is called by webextention-toolbox
 *
 * @export
 * @param {object} config original webpack config
 * @param {*} { dev, vendor } environment vars:
 *             dev shows whether is development mode
 * @return {object} modified config
 */
module.exports = {
    webpack: (config, { dev, vendor }) => {
        config.plugins.push(
            new MiniCssExtractPlugin({
                // Options similar to the same options
                // in webpackOptions.output
                // both options are optional
                filename: dev ? '[name].css' : '[name].[hash].css',
                chunkFilename: dev ? '[id].css' : '[id].[hash].css',
            }),
        );
        config.plugins.push(
            new CopyPlugin({
                patterns: [{
                    from: '../node_modules/picnic/picnic.min.css',
                    to: 'styles',
                },
                {
                    from: '../node_modules/flag-icon-css/css/flag-icon.min.css',
                    to: 'styles',
                },
                {
                    from: '../node_modules/flag-icon-css/flags/',
                    to: 'flags',
                    toType: 'dir',
                }]
            }),
        );
        config.devtool = 'inline-source-map';
        return config;
    },
};
