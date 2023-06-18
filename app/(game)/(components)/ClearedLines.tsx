import { Container } from "@pixi/react";
import { useRef } from "react";

import { GAME_PANEL, ClearRecord, TetrominoType } from "./Utils";
import ClearedBlock from "./ClearedBlock";
import DamageNumber from "./DamageNumber";

export default function ClearedLines({
  clearRecordsArr,
}: {
  clearRecordsArr: ClearRecord[];
}) {
  const linesCleared = useRef<number>(0);
  const blocksCleared = useRef<number>(0);

  return clearRecordsArr.map((clearRecord, index) => {
    const { idx: rowIndex, lineTypeArr } = clearRecord;

    return (
      <Container key={`cleared-line-${(linesCleared.current += 1)}`}>
        {lineTypeArr.map((type, colIndex) => (
          <ClearedBlock
            type={type}
            initialXDisplacement={GAME_PANEL.X + GAME_PANEL.CHILD * colIndex}
            initialYDisplacement={GAME_PANEL.Y + GAME_PANEL.CHILD * rowIndex}
            key={`cleared-block-${(blocksCleared.current += 1)}`}
          />
        ))}
        {lineTypeArr.includes(TetrominoType.Grey) ? null : (
          <DamageNumber
            clearRecord={clearRecord}
            delayMultiplier={index}
            initialXDisplacement={GAME_PANEL.X}
            initialYDisplacement={GAME_PANEL.Y + GAME_PANEL.CHILD * rowIndex}
          />
        )}
      </Container>
    );
  });
}
