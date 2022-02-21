import type { NextPage } from 'next';

import Head from 'next/head';

import Landing from './landing';

const Home: NextPage = () => {
  return (
    <div className="bg-gray-800 h-screen min-w-fit px-3 py-3">
      <Head>
        <title>TetriBASS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Landing />
    </div>
  );
};

export default Home;
