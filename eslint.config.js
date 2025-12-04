import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import"; // Add this

export default tseslint.config(
  { ignores: ["dist", "coverage", "node_modules"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      import: importPlugin, // Include the plugin
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      // Add the import/order rule
      "import/order": [
        "warn",
        {
          groups: [
            ["builtin", "external"], // Node.js and external libraries
            ["internal", "parent", "sibling", "index"], // Internal and relative imports
            "type", // Type imports (from TypeScript)
          ],
          pathGroups: [
            {
              pattern: "react",
              group: "builtin",
              position: "before",
            },
            {
              pattern: "@/**", // Adjust if using aliases like `@/*` for absolute imports
              group: "internal",
              position: "before",
            },
          ],
          pathGroupsExcludedImportTypes: ["react"],
          alphabetize: {
            order: "asc", // Sort in ascending order
            caseInsensitive: true, // Ignore case when sorting
          },
          "newlines-between": "always", // Add newline between groups
        },
      ],
      "no-unused-vars": "off", // Disable base ESLint rule
      "@typescript-eslint/no-unused-vars": [
        "warn", // You can set this to "error" if needed
        {
          vars: "all", // Check all variables
          args: "after-used", // Ignore unused function arguments after the last used one
          ignoreRestSiblings: true, // Ignore rest siblings in object destructuring
        },
      ],
    },
  }
);
