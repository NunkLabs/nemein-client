import type { NextPage } from "next";

import Head from "next/head";

import { Game } from "components/Game";

const Home: NextPage = () => {
  return (
    <div className="bg-gray-800 h-screen min-w-fit relative">
      <Head>
        <title>TetriBASS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Game />
    </div>
  );
};

export default Home;
