import { Close } from "@radix-ui/react-dialog";
import { useEffect } from "react";
import { useTheme } from "next-themes";
import { m } from "framer-motion";

import { useGameStore } from "libs/Store";
import { buttonVariants } from "components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "components/ui/Dialog";
import { Label } from "components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/Select";
import { Switch } from "components/ui/Switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/Tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "components/ui/Tooltip";
import { useToast } from "components/ui/UseToast";

export default function OptionsPanel() {
  const gameOptions = useGameStore((state) => state.gameOptions);
  const updateGameOptions = useGameStore((state) => state.updateGameOptions);
  const updateGameTheme = useGameStore((state) => state.updateGameTheme);

  const { resolvedTheme, setTheme } = useTheme();
  const { toast } = useToast();

  useEffect(() => {
    /**
     * Updates the theme in the game store because the useTheme hook won't work
     * inside Pixi components
     */
    updateGameTheme(resolvedTheme);
  }, [resolvedTheme, updateGameTheme]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <m.button
          className={buttonVariants({ variant: "secondary" })}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
        >
          Options
        </m.button>
      </DialogTrigger>
      <DialogContent>
        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="graphics">Graphics</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <div className="flex flex-row items-center justify-between p-3">
              <div className="space-y-1">
                <Label className="text-base">Game Mode</Label>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Select the preferred game mode
                </p>
              </div>
              <Select
                onValueChange={(
                  gameModeSelection: typeof gameOptions.gameMode,
                ) => {
                  updateGameOptions({
                    gameMode: gameModeSelection,
                  });

                  toast({
                    title: "Game mode changed!",
                    description: `
                      ${gameModeSelection} will now launch on your next game
                    `,
                  });
                }}
              >
                <SelectTrigger className="w-44">
                  <SelectValue placeholder={gameOptions.gameMode} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classic">classic</SelectItem>
                  <SelectItem value="nemein">nemein</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-row items-center justify-between p-3">
              <div className="space-y-1">
                <Label className="text-base">Performance Display</Label>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Show latency and frame rate
                </p>
              </div>
              <Switch
                checked={gameOptions.performanceDisplay}
                onCheckedChange={(enablePerformanceDisplay: boolean) =>
                  updateGameOptions({
                    performanceDisplay: enablePerformanceDisplay,
                  })
                }
              />
            </div>
            <div className="flex flex-row items-center justify-between p-3">
              <div className="space-y-1">
                <Label className="text-base">Dark Mode</Label>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Embrace the dark
                </p>
              </div>
              <Switch
                checked={resolvedTheme === "dark"}
                onCheckedChange={(enableDarkMode: boolean) =>
                  setTheme(enableDarkMode ? "dark" : "light")
                }
              />
            </div>
          </TabsContent>
          <TabsContent value="graphics">
            <div className="flex flex-row items-center justify-between p-3">
              <div className="space-y-1">
                <Label className="text-base">Antialiasing</Label>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Smooth out block edges
                </p>
              </div>
              <Switch
                checked={gameOptions.antialias}
                onCheckedChange={(enableAntialias: boolean) =>
                  updateGameOptions({
                    antialias: enableAntialias,
                  })
                }
              />
            </div>
            <div className="flex flex-row items-center justify-between p-3">
              <div className="space-y-1">
                <Label className="text-base">GPU Mode</Label>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Change the WebGL GPU power preference
                </p>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Select
                      onValueChange={(
                        powerPreferenceSelection: typeof gameOptions.powerPreference,
                      ) =>
                        updateGameOptions({
                          powerPreference: powerPreferenceSelection,
                        })
                      }
                    >
                      <SelectTrigger className="w-44">
                        <SelectValue
                          placeholder={gameOptions.powerPreference}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">default</SelectItem>
                        <SelectItem value="high-performance">
                          high performance
                        </SelectItem>
                        <SelectItem value="low-power">low power</SelectItem>
                      </SelectContent>
                    </Select>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      It is recommended to leave this on default. This option is
                      a hint to help your system pick your preferred GPU
                      configuration if you have more than 1 GPU available.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </TabsContent>
          <TabsContent value="accessibility">
            <div className="flex flex-row items-center justify-between p-3">
              <div className="space-y-1">
                <Label className="text-base">Stage Shake</Label>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Toggle the shake effect on line clear
                </p>
              </div>
              <Switch
                checked={gameOptions.stageShake}
                onCheckedChange={(enableStageShake: boolean) =>
                  updateGameOptions({
                    ...gameOptions,
                    stageShake: enableStageShake,
                  })
                }
              />
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Close className={buttonVariants({ variant: "primary" })}>
            Close
          </Close>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
