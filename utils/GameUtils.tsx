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

  field.forEach((row, rowIndex) => {
    retField.push(
      <div className="row" key={`row-${rowIndex}`}>
        {row.map((col, colIndex) => {
          let colStyle = `col-${col}`;

          if (
            (over && col !== TetrominoType.Blank) ||
            col === TetrominoType.Ghost
          ) {
            colStyle = "col-ghost";
          }

          return (
            <div
              className={`col ${colStyle} ${queue ? "col-queue" : ""}`}
              key={`col-${colIndex}`}
            />
          );
        })}
      </div>
    );
  });

  return retField;
}
