import type { NextPage } from "next";

import Head from "next/head";
import { Tetris } from "components";

const Home: NextPage = () => {
  return (
    <div className="bg-gray-800 h-screen min-w-fit relative">
      <Head>
        <title>TetriBASS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Tetris />
    </div>
  );
};

export default Home;
