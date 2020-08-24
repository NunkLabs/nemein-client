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

  field.forEach((row) => {
    const cols = row.map((column: number) => <div className={`col-${column}`} key={uuid()} />);
    board.push(<div className="tetris-row" key={uuid()}>{cols}</div>);
  });

  return (
    <div className="tetris-main">
      <div className="tetris-info">
        <p className="tetris-text">
          Level:
          {level}
        </p>
        <p className="tetris-text">
          Score:
          {score}
        </p>
      </div>
      <div className="tetris-board">{board}</div>
    </div>
  );
};

export default TetrisBoard;
