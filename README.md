# TetriBASS Client

## Getting started

Previously, this project recommended using `nvm` & `yarn`. However, this approach results in some minor but annoying issues during deployment. We now use [pnpm](https://pnpm.io/installation) to manage the Node.js environment and its packages. This [nvm uninstall guide](https://www.linode.com/docs/guides/how-to-install-use-node-version-manager-nvm/#nvm-uninstall-steps) might be helpful if you want to make the switch.

The latest LTS version of Node.js is recommended.

```
pnpm env use --global lts
```

**To install**

```
pnpm install
```

**Build & start in development mode**

```
pnpm dev
```

**Build & start in production mode**

```
pnpm start
```

**Set environment variables**

Next.js loads environment variables in a specific [order](https://nextjs.org/docs/basic-features/environment-variables#environment-variable-load-order). `.env.development` will be the default when running `pnpm dev` while `.env.production` will be the defaults when running `pnpm build && pnpm start`. To override the default env variables, please create and use a `.env.local` file.

**Coding standards**

This project uses [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/) to ensure proper JavaScript/TypeScript coding style and readability. We are currently using the included Next ESLint config as the base config. Make sure to have ESLint set up in your development environment, see [Getting Started with ESLint](https://eslint.org/docs/user-guide/getting-started).

## Basic project structure

```
Client
├── .next // Client compiled output
├── app
│   ├── (game)
│   │   └── (prompts)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.txs
├── constants
├── libs
├── public
├── typings
└── utils
```
