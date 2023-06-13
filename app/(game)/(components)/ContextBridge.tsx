import { Stage } from "@pixi/react";
import { Context, ReactNode, useContext } from "react";

import { GameContext } from "../Game";
import { STAGE_SIZE } from "./Utils";

/**
 * By design, React doesn't allow passing parent contexts to child components
 * from a custom renderer like Pixi. Therefore, it is not possible to access
 * React context in Pixi's components. We workaround this by using this context
 * bridge, which helps us feed the context to components rendered by Pixi.
 */
function ContextBridge<T>({
  children,
  context,
  render,
}: {
  children: ReactNode;
  context: Context<T>;
  render: (children: React.ReactNode) => JSX.Element;
}) {
  return (
    <context.Consumer>
      {(value) =>
        render(<context.Provider value={value}>{children}</context.Provider>)
      }
    </context.Consumer>
  );
}

/* Wraps our context bridge around the Pixi's Stage */
export default function StageWrapper({
  children,
  ...props
}: {
  children: ReactNode;
}) {
  const { gameSettings } = useContext(GameContext);

  return (
    <ContextBridge
      context={GameContext}
      render={(children) => (
        <Stage
          className="opacity-0"
          id="game-stage"
          height={STAGE_SIZE}
          width={STAGE_SIZE}
          options={{
            hello: true, // Logs Pixi version & renderer type
            antialias: gameSettings.antialias,
            backgroundAlpha: 0,
            powerPreference: gameSettings.powerPreference,
          }}
          {...props}
        >
          {children}
        </Stage>
      )}
    >
      {children}
    </ContextBridge>
  );
}
