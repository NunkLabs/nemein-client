module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
    ecmaVersion: 2020
  },
  extends: [
    "airbnb-typescript/base",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  plugins: [
    "import"
  ],
  rules: {
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        "checksVoidReturn": false
      }
    ],
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "js": "never",
        "jsx": "never",
        "ts": "never",
        "tsx": "never"
      }
    ],
    "class-methods-use-this": [
      "error",
      { 
        "exceptMethods": [
          "write"
        ] 
      }
    ]
  }
}
