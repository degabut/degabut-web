module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:import/recommended",
		"plugin:import/typescript",
		"plugin:@typescript-eslint/recommended",
		"plugin:solid/typescript",
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
	},
	plugins: ["@typescript-eslint"],
	settings: {
		"import/resolver": {
			typescript: true,
			node: true,
		},
	},
	rules: {
		// indent: ["error", "tab"], // TODO: fix this, causes error at the moment
		"linebreak-style": ["error", "unix"],
		quotes: ["error", "double"],
		semi: ["error", "always"],
		"no-mixed-spaces-and-tabs": ["off"],
		"import/no-duplicates": ["error", { "prefer-inline": true }],
		"@typescript-eslint/no-empty-function": ["off"],
		"@typescript-eslint/consistent-type-imports": [
			"error",
			{
				prefer: "type-imports",
				fixStyle: "inline-type-imports",
			},
		],
	},
};
