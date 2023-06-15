import { Container } from "@pixi/react";
import { useRef } from "react";

import { GAME_PANEL, ClearRecord } from "./Utils";
import ClearedBlock from "./ClearedBlock";

export default function ClearedLines({
  clearRecordsArr,
}: {
  clearRecordsArr: ClearRecord[];
}) {
  const linesCleared = useRef<number>(0);
  const blocksCleared = useRef<number>(0);

  return clearRecordsArr.map(({ idx: rowIndex, lineTypeArr }) => {
    linesCleared.current += 1;

    lineTypeArr.map((type, colIndex) => {
      blocksCleared.current += 1;

      return (
        <ClearedBlock
          type={type}
          initialXDisplacement={GAME_PANEL.X + GAME_PANEL.CHILD * colIndex}
          initialYDisplacement={GAME_PANEL.Y + GAME_PANEL.CHILD * rowIndex}
          key={`cleared-${linesCleared.current}-${blocksCleared.current}`}
        />
      );
    });
  });
}
