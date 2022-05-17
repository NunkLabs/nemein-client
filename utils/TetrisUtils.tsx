import styles from "styles/components/Tetris.module.css";

/**
 * @brief: fieldToJsxElement: Convert a field of coords to a JSX element for
 * render
 * @param  {number[][]}     field  Field to render
 * @param  {boolean}        grid   Toggle for the game grid
 * @return {JSX.Element[]}         JSX element of field
 */
export const fieldToJsxElement = (
  field: number[][],
  grid: boolean = false,
  queue: boolean = false
): JSX.Element[] => {
  const retField: JSX.Element[] = [];

  field.forEach((col, colIndex) => {
    const rows = col.map((row, rowIndex) => (
      <div
        className={`
          ${styles.row} ${styles[grid ? `row-wgrid-${row}` : `row-${row}`]}
          ${styles[queue ? "row-queue" : ""]}
        `}
        key={`row-${rowIndex}`}
      />
    ));

    retField.push(
      <div className="flex" key={`col-${colIndex}`}>
        {rows}
      </div>
    );
  });

  return retField;
};
