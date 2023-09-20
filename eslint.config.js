import tsEsLintPlugin from "@typescript-eslint/eslint-plugin"
import tsEsLintParser from "@typescript-eslint/parser"

export default [
  {
    ignores: ["dist"]
  },
  {
    plugins: {
      "@typescript-eslint": tsEsLintPlugin,
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsEsLintParser,
      parserOptions: {
        project: true,
      },
    },
    rules: {
      ...tsEsLintPlugin.configs["eslint-recommended"].rules,
      "semi": ["error", "never"]
    },
  },
]
