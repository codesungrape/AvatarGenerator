// eslint.config.mjs
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import vuePlugin from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";

export default [
  {
    // Global base
    ignores: ["dist/**", "node_modules/**"],
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
  },

  // JavaScript configuration
  {
    files: ["**/*.js"],
    ...js.configs.recommended,
  },

  // TypeScript configuration
  {
    files: ["**/*.ts"],
    ...tseslint.configs.recommended[0],
  },

  // Vue specific configuration
  {
    files: ["**/*.vue"],
    plugins: {
      vue: vuePlugin,
    },
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 2022,
        sourceType: "module",
        extraFileExtensions: [".vue"],
      },
    },
    processor: vuePlugin.processors[".vue"],
    rules: {
      // Essential Vue rules
      "vue/comment-directive": "error",
      "vue/jsx-uses-vars": "error",

      // Vue 3 specific rules
      "vue/no-deprecated-slot-attribute": "error",
      "vue/no-deprecated-slot-scope-attribute": "error",
      "vue/no-deprecated-scope-attribute": "error",

      // Composition API rules
      "vue/define-props-declaration": "error",
      "vue/define-emits-declaration": "error",
      "vue/no-export-in-script-setup": "error",

      // Template rules
      "vue/html-indent": ["error", 2],
      "vue/html-self-closing": "warn",
      "vue/multi-word-component-names": "warn",
      "vue/no-unused-components": "warn",
      "vue/require-v-for-key": "error",
    },
  },

  // Declaration files
  {
    files: ["**/*.d.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  // General configuration for all files
  {
    files: ["**/*.{js,ts,vue}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];
