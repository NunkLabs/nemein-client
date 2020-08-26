import React from 'react';
import { v4 as uuid } from 'uuid';

type TetrisBoardProps =
{
  field: number[][];
  score: number;
  level: number;
  rotate: number;
};

const TetrisBoard: React.FC<TetrisBoardProps> = (props: TetrisBoardProps) => {
  const board: JSX.Element[] = [];
  const { field, score, level } = props;

  field.forEach((col) => {
    const rows = col.map((row: number) => <div className={`row-${row}`} key={uuid()} />);
    board.push(<div className="tetris-col" key={uuid()}>{rows}</div>);
  });

  return (
    <div className="tetris-main">
      <div className="tetris-info">
        <div className="row">
          <div className="col">
            <p className="tetris-text">
              Level
            </p>
            <p>
              {level}
            </p>
          </div>
          <div className="col">
            <p className="tetris-text">
              Score
            </p>
            <p>
              {score}
            </p>
          </div>
        </div>
      </div>
      <div className="tetris-board">{board}</div>
    </div>
  );
};

export default TetrisBoard;
