/** @type {import("prettier").Config} */
export default {
	trailingComma: "none",
	tabWidth: 4,
	useTabs: true,
	semi: false,
	singleQuote: true,
	arrowParens: "avoid",
	printWidth: 100,

	importOrder: ["^node:.*$", "^@?\\w", "^../(.*)$", "^./(.*)$"],

	importOrderSeparation: true,
	importOrderSortSpecifiers: true,
	importOrderCaseInsensitive: true,

	plugins: [
		"@trivago/prettier-plugin-sort-imports",
		"prettier-plugin-tailwindcss",
	],
};
