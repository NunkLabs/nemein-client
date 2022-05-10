import type { NextPage } from 'next';

import Head from 'next/head';
import { useCallback, useEffect, useState, useRef } from 'react';
import { StartPrompt, Tetris } from 'components';

const Home: NextPage = () => {
  const ws = useRef<WebSocket | null>(null);

  const [init, setInit] = useState(false);
  const [tetrisData, setTetrisData] = useState<MessageEvent['data'] | null>(
    null
  );

  useEffect(() => {
    if (init) {
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
    }
  }, [init, ws]);

  const initGame = useCallback(() => setInit(true), []);

  return (
    <div className="bg-gray-800 h-screen min-w-fit relative">
      <Head>
        <title>TetriBASS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {init ? null : <StartPrompt setInit={initGame} />}
      <Tetris tetrisData={tetrisData} />
    </div>
  );
};

export default Home;
