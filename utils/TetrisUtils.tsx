import { TetrominoType } from "constants/Tetris";

import styles from "styles/components/Tetris.module.css";

/**
 * @brief: fieldToJsxElement: Convert a field of coords to a JSX element for
 * render
 * @param  {number[][]}     field  Field to render
 * @param  {boolean}        over   Whether the game is over
 * @param  {boolean}        grid   Toggle for the game grid
 * @param  {boolean}        queue  Whether the field is for the queue panel
 * @return {JSX.Element[]}         JSX element of field
 */
export const fieldToJsxElement = (
  field: number[][],
  over: boolean = false,
  grid: boolean = false,
  queue: boolean = false
): JSX.Element[] => {
  const retField: JSX.Element[] = [];

  field.forEach((col, colIndex) => {
    retField.push(
      <div className="flex" key={`col-${colIndex}`}>
        {col.map((row, rowIndex) => {
          let rowStyle = `row${grid ? "-grid" : ""}-${row}`;

          if (
            (over && row !== TetrominoType.Blank) ||
            row === TetrominoType.Ghost
          ) {
            rowStyle = "row-ghost";
          }

          return (
            <div
              className={`
                ${styles.row} ${styles[rowStyle]}
                ${styles[queue ? "row-queue" : ""]}
              `}
              key={`row-${rowIndex}`}
            />
          );
        })}
      </div>
    );
  });

  return retField;
};
