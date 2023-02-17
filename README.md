# TetriBASS Client

## Getting started

The minimum version of Node.js required is **Node.js LTS 18.x**.

**To install**

```
yarn install
```

**Build & start in development mode**

Install these global packages for dev scripts to work

```
yarn global add typescript eslint
```

```
yarn dev
```

**Build & start in production mode**

```
yarn build && yarn start
```

**Set environment variables**

Next.js loads environment variables in a specific [order](https://nextjs.org/docs/basic-features/environment-variables#environment-variable-load-order). `.env.development` will be the default for `yarn dev`, `.env.production` will be the defaults for `yarn build && yarn start`. To override the default env variables, please create and use a `.env.local` file.

**Coding standards**

This project uses [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/) to ensure proper JavaScript/TypeScript coding style and readability. We are currently using the included Next ESLint config as the base config. Make sure to have ESLint set up in your development environment, see [Getting Started with ESLint](https://eslint.org/docs/user-guide/getting-started).

Remember to run the formatter before a push!

```
yarn format
```
