# TetriBASS

## Getting started

The minimum version of Node.js required is **Node.js LTS 14.x**, and **Yarn stable 1.22.x**. You will also need **TypeScript**, **serve**, and **dotenv**!

```
yarn global add typescript serve dotenv
```

For development, you will also need **ESLint**, **nodemon**, and **concurrently**.

```
yarn global add typescript serve dotenv eslint nodemon concurrently
```

First make sure you are using Yarn! Second make sure you install with `yarn install --frozen-lockfile` to avoid making unnecessary changes to the **yarn.lock** file.

It is recommended to run this every time after you do a pull from `master`.


**To install**

```
yarn install --frozen-lockfile
```


**To clean your working directory**

```
yarn clean
```


## Building & contributing

For the project to launch properly, make sure you make a copy of **config.ts.example** and rename it to **config.ts**, and fill it out, see [config.ts.example](server/src/configs/config.ts.example).


**Build & start in development mode**

Client

```
yarn dev:client
```

Server

```
yarn dev:server
```


**Build & start in production mode**

```
yarn start
```


**Coding standards**

This project uses [ESLint](https://eslint.org/) as a linter to ensure proper JavaScript/TypeScript coding style. We are currently using [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) as our base ESLint config. Make sure to have ESLint set up in your development environment, see [Getting Started with ESLint](https://eslint.org/docs/user-guide/getting-started).

Remember to run the linter before a push!

```
yarn lint
```


## Project structure

```
TetriBASS
├── client
│   ├── build // Client compiled output
│   └── src
│       └── index.tsx
└── server
    ├── build // Server compiled output
    └── src
        ├── configs
        │   └── config.ts // Server config file with API keys, credentials, etc
        └── index.ts
```