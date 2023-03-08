import { TetrominoType } from "constants/Game";

/**
 * @brief: fieldToJsxElement: Convert a field of coords to a JSX element for
 * render
 * @param  {number[][]}     field  Field to render
 * @param  {boolean}        over   Whether the game is over
 * @param  {boolean}        queue  Whether the field is for the queue panel
 * @return {JSX.Element[]}         JSX element of field
 */
export default function fieldToJsxElement(
  field: number[][],
  over: boolean = false,
  queue: boolean = false
): JSX.Element[] {
  const retField: JSX.Element[] = [];

  field.forEach((col, colIndex) => {
    retField.push(
      <div className="flex" key={`col-${colIndex}`}>
        {col.map((row, rowIndex) => {
          let rowStyle = `row-${row}`;

          if (
            (over && row !== TetrominoType.Blank) ||
            row === TetrominoType.Ghost
          ) {
            rowStyle = "row-ghost";
          }

          return (
            <div
              className={`row ${rowStyle} ${queue ? "row-queue" : ""}`}
              key={`row-${rowIndex}`}
            />
          );
        })}
      </div>
    );
  });

  return retField;
}
