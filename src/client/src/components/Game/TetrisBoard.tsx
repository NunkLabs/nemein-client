import React from 'react';

type TetrisBoardProps =
{
  field: any[];
  gameOver: boolean;
  score: number;
  level: number;
  rotate: number;
};

const TetrisBoard: React.FC<TetrisBoardProps> = (props) => {
  const rows: any[] = [];
  props.field.forEach((row, index) => {
    const cols = row.map((column: any, index: number) => <div className={`col-${column}`} key={index} />);
    rows.push(<div className="tetris-row" key={index}>{cols}</div>);
  });

  return (
    <div className="tetris-main">
      <div className="tetris-info">
        <p className="tetris-text">
          Level:
          {props.level}
        </p>
        <p className="tetris-text">
          Score:
          {props.score}
        </p>
        {props.gameOver && <p className="tetris-text">Game Over</p>}
      </div>
      <div className="tetris-board">{rows}</div>
    </div>
  );
};

export default TetrisBoard;
