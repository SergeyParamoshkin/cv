module.exports = {
	root: true,
	env: { node: true },
	extends: ['plugin:vue/vue3-recommended', 'eslint:recommended', 'prettier'],
	parserOptions: {
		parser: '@babel/eslint-parser',
		ecmaVersion: 2020,
	},
	rules: {
		'vue/multi-word-component-names': 'warn',
	},
};
