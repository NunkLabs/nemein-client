import type { NextPage } from 'next';

import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Tetris from 'components';

const Home: NextPage = () => {
  const ws = useRef<WebSocket | null>(null);

  const [tetrisData, setTetrisData] = useState<MessageEvent['data'] | null>(
    null
  );

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8080');

    const validKeyboardKeys = [
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      ' ',
      'c',
    ];

    const keydownHandler = ({ key }: { key: string }) => {
      if (!validKeyboardKeys.includes(key)) return;

      ws.current?.send(key);
    };

    ws.current.onopen = () => {
      document.addEventListener('keydown', keydownHandler);
    };

    ws.current.onclose = () => {
      document.removeEventListener('keydown', keydownHandler);
    };

    ws.current.onmessage = (event) => {
      setTetrisData(JSON.parse(event.data));
    };

    const wsCurrent = ws.current;

    return () => {
      /* Clean up on component unmount */
      wsCurrent.close();
    };
  }, [ws]);

  return (
    <div className="bg-gray-800 h-screen min-w-fit px-5 py-5">
      <Head>
        <title>TetriBASS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Tetris tetrisData={tetrisData} />
    </div>
  );
};

export default Home;
