import babelEslintParser from '@babel/eslint-parser'
import eslintJs from '@eslint/js'
import globals from 'globals'

export default [
  eslintJs.configs.recommended,
  {
    languageOptions: {
      parser: babelEslintParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false,
        },
      },
      globals: {
        ...globals.builtin,
        ...globals.browser,
        ...globals.commonjs,
        VERSION: true,
        ENV: true,
      },
    },
    rules: {
      quotes: ['error', 'single', { 'avoidEscape': true, 'allowTemplateLiterals': false }],
      'prefer-const': 2,
    },
  },
  {files: ['build/**/*.js'], languageOptions:{globals: {...globals.node}}},
  {
    ignores: ['test','dist','coverage'],
  }
]
