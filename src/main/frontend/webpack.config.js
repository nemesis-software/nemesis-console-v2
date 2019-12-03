const path = require('path');

module.exports = {
	entry: [
		'./src/index.js'
	],
	output: {
		path: path.join(__dirname, '../webapp/resources'),
		publicPath: 'resources/',
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader"
				}
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
			},
			{
				test: /\.less$/,
				use: [
					'style-loader',
					'css-loader',
					'less-loader'
				]
			},
			{
				test: /\.png$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 100000
						}
					}
				]
			},
			{
				test: /\.jpg$/,
				use: [
					{
						loader: 'file-loader'
					}
				]
			},
			{
				test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 100000,
							mimetype: 'application/font-woff'
						}
					}
				]
			},
			{
				test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 100000,
							mimetype: 'application/octet-stream'
						}
					}
				]
			},
			{
				test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
				use: [
					{
						loader: 'file-loader'
					}
				]
			},
			{
				test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 100000,
							mimetype: 'image/svg+xml'
						}
					}
				]
			}
		]
	},
	resolve: {
		alias: {
			source: path.join(__dirname, 'src'),
			customFiles: path.join(__dirname, 'src/custom_files'),
			localesDir: path.join(__dirname, 'src/locales'),
			servicesDir: path.join(__dirname, 'src/app/services')
		},
		extensions: ['.js', '.jsx']
	}
};
