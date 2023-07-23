import { useEffect, useState } from "react";

import { buttonVariants } from "components/ui/Button";
import OptionsPanel from "./Options";

export default function StartPanel({
  loadingProgress,
  loadStage,
}: {
  loadingProgress: number;
  loadStage: () => void;
}) {
  const [requestStage, setRequestStage] = useState<boolean>(false);

  useEffect(() => {
    if (loadingProgress < 100 || !requestStage) return;

    loadStage();
  }, [loadingProgress, loadStage, requestStage]);

  return (
    <div className="fixed left-1/2 top-1/2 flex translate-x-[-50%] translate-y-[-50%] flex-col place-items-center gap-y-2 text-center">
      <h1 className="text-5xl">nemein</h1>
      <button
        className={buttonVariants({ variant: "primary" })}
        onClick={() => setRequestStage(true)}
        type="button"
      >
        Play
      </button>
      <div>
        <OptionsPanel />
      </div>
    </div>
  );
}
