import type { NextPage } from 'next';

import React, { useEffect, useRef } from 'react';
import Head from 'next/head';

const Home: NextPage = () => {
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      ws.current = new WebSocket('ws://127.0.0.1:8080');

      ws.current.onopen = () => {
        document.addEventListener('keydown', ({ key }) => {
          if (!ws.current) return;

          ws.current.send(key);
        });
      };
    }

    return () => {
      if (!ws.current) return;

      if (ws.current.readyState !== 3) {
        ws.current.close(1000);
      }
    };
  }, []);

  return (
    <div className="bg-gray-800 h-screen min-w-fit px-3 py-3">
      <Head>
        <title>TetriBASS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  );
};

export default Home;
