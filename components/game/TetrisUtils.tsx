/**
 * @brief: fieldToJsxElement: Convert a field of coords to a JSX element for
 * render
 * @param[in]: field - Field to render
 * @return: JSX element of field
 */
export function fieldToJsxElement(
  field: number[][],
  grid: boolean = false
): JSX.Element[] {
  const retField: JSX.Element[] = [];

  field.forEach((col) => {
    const rows = col.map((row: number) => (
      // eslint-disable-next-line react/jsx-key
      <div
        className={`
          row${grid ? '-wgrid' : ''} row${grid ? '-wgrid' : ''}-${row}
        `}
      />
    ));

    retField.push(<div className="flex">{rows}</div>);
  });

  return retField;
}
