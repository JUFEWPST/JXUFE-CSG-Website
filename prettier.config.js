/** @type {import('prettier').Config} */
export default {
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  pluginSearchDirs: false,
  plugins: ['prettier-plugin-tailwindcss'],
  importOrder: ['^@', '^[a-zA-Z0-9-]+', '^[./]'],
};