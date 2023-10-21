// eslint-disable-next-line import/no-anonymous-default-export
export default {
	plugins: [
		'@ianvs/prettier-plugin-sort-imports',
		'prettier-plugin-tailwindcss',
	],
	trailingComma: 'all',
	tabWidth: 2,
	semi: false,
	singleQuote: true,
	useTabs: true,
	jsxSingleQuote: true,
	importOrder: [
		'react/*',
		'next/*',
		'@/components/*',
		'@/lib/*',
		'@/hooks/*',
		'@/styles/*',
		'@/types/*',
		'^[./]',
	],
	importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
}
