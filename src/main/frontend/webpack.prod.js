const webpack = require('webpack');
const Merge = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');

const CommonConfig = require('./webpack.config.js');

module.exports = Merge(CommonConfig, {
    mode: 'production',
	optimization: {
		minimize: false,

		minimizer: [new TerserPlugin({
			terserOptions: {
				ecma: undefined,
				warnings: false,
				parse: {},
				compress: {},
				mangle: true, // Note `mangle.properties` is `false` by default.
				module: false,
				output: null,
				toplevel: false,
				nameCache: null,
				ie8: false,
				keep_classnames: undefined,
				keep_fnames: false,
				safari10: false,
			}
		})],

	},
	plugins: [
		new webpack.LoaderOptionsPlugin({
			minimize: true,
			debug: false
		}),

	]
});
