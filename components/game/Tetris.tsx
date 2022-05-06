import { useEffect, useState, useRef } from 'react';

import * as TetrisConsts from './TetrisConsts';
import { fieldToJsxElement } from './TetrisUtils';

type TetrisCol = {
  colArr: number[];
  lowestY: number;
};

const Tetris = () => {
  const ws = useRef<WebSocket | null>(null);

  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);

  const [gameField, setGameField] = useState<number[][]>([]);
  const [heldField, setHeldField] = useState<number[][]>(
    TetrisConsts.RENDER_TETROMINOS_ARR[0]
  );
  const [spawnedFields, setSpawnedFields] = useState<JSX.Element[]>([]);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8080');

    const validKeyboardKeys = [
      'ArrowDowm',
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
      const { field, heldTetromino, spawnedTetrominos } = JSON.parse(
        event.data
      );

      const renderTetrominos = TetrisConsts.RENDER_TETROMINOS_ARR;

      /* Prepare an HTML element for the main game board */
      const renderField: number[][] = [];

      for (let y = 0; y < 23; y += 1) {
        const row = [];

        for (let x = 0; x < 14; x += 1) {
          row.push(field[x].colArr[y]);
        }

        renderField.push(row);
      }

      setGameField(renderField);

      /* Prepare an HTML element for the currently held tetromino */
      setHeldField(renderTetrominos[heldTetromino]);

      /* Prepare HTML elements for the tetromino queue */
      const spawnedTetrominosFieldsRender: JSX.Element[][] = [];

      console.log(spawnedTetrominos);

      spawnedTetrominos.forEach((tetromino: TetrisConsts.Tetromino) => {
        const spawnedTetrominoFieldRender = fieldToJsxElement(
          renderTetrominos[tetromino]
        );

        spawnedTetrominosFieldsRender.push(spawnedTetrominoFieldRender);
      });

      const spawnedTetrominosFields = spawnedTetrominosFieldsRender
        // eslint-disable-next-line react/jsx-key
        .map((tetromino) => <div className="tetris-next">{tetromino}</div>);

      setSpawnedFields(spawnedTetrominosFields);
    };

    const wsCurrent = ws.current;

    return () => {
      /* Clean up on component unmount */
      wsCurrent.close();
    };
  }, [ws]);

  return (
    <div className="grid place-items-center">
      <div className="tetris-info">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p>LEVEL</p>
            <p>{level}</p>
          </div>
          <div>
            <p>SCORE</p>
            <p>{score}</p>
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <div className="tetris-held place-self-start">
          {fieldToJsxElement(heldField)}
        </div>
        <div className="tetris-board">{fieldToJsxElement(gameField)}</div>
        <div className="tetris-queue grid grid-rows-4 gap-3">
          {spawnedFields}
        </div>
      </div>
    </div>
  );
};

export default Tetris;
