const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
	transpileDependencies: true,
	productionSourceMap: false,

	css: {
		extract: true,
		sourceMap: false,
	},

	configureWebpack: {
		optimization: {
			splitChunks: {
				chunks: 'all',
				cacheGroups: {
					fontawesome: {
						test: /[\\/]node_modules[\\/]@fortawesome[\\/]/,
						name: 'fontawesome',
						priority: 20,
					},
				},
			},
		},
	},

	chainWebpack: (config) => {
		config.resolve.alias.set('@', require('path').resolve(__dirname, 'src'));
	},
});
