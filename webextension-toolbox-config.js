// This file is not going through babel transformation.
// So, we write it in vanilla JS
// (But you could use ES2015 features supported by your Node.js version)

const CopyPlugin = require('copy-webpack-plugin');

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
    webpack: (config) => {
        // not used for now because it does not work
        // config.module.rules.push({
        //     test: /\.(sa|sc|c)ss$/,
        //     exclude: /node_modules/,
        //     use: [
        //         // fallback to style-loader in development
        //         MiniCssExtractPlugin.loader,
        //         require.resolve('sass-loader'), // compiles Sass to CSS
        //         require.resolve('css-loader'),
        //     ],
        // });
        // not used for now because it does not work
        // config.plugins.push(
        //     new MiniCssExtractPlugin({
        //         // Options similar to the same options
        //         // in webpackOptions.output
        //         // both options are optional
        //         filename: devMode ? '[name].css' : '[name].[hash].css',
        //         chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
        //     }),
        // );

        config.plugins.push(
            new CopyPlugin([{
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
                },
            ]),
        );
        config.devtool = 'inline-module-source-map';
        return config;
    },
};
