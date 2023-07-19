import { useEffect, useState } from "react";

import OptionsPanel from "./Options";

export default function StartPrompt({
  loadingProgress,
  loadStage,
}: {
  loadingProgress: number;
  loadStage: () => void;
}) {
  const [requestStage, setRequestStage] = useState<boolean>(false);
  const [requestOptions, setRequestOptions] = useState<boolean>(false);

  useEffect(() => {
    if (loadingProgress < 100 || !requestStage) return;

    loadStage();
  }, [loadingProgress, requestStage, loadStage]);

  return (
    <div>
      <button
        className="button button-light absolute left-1/2 top-1/2 z-[50]
            h-[32px] w-[176px] translate-x-[-50%] translate-y-[-50%]"
        id="start-button"
        onClick={() => setRequestStage(true)}
        type="button"
      >
        Play
      </button>
      <button
        className="button button-alt absolute left-1/2 top-1/2 z-[50]
          h-[32px] w-[176px] translate-x-[-50%] translate-y-[70%]"
        id="settings-button"
        onClick={() => setRequestOptions(true)}
        type="button"
      >
        Settings
      </button>
      {requestOptions && (
        <OptionsPanel toggleOptions={() => setRequestOptions(false)} />
      )}
    </div>
  );
}
