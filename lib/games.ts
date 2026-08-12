export type GameId = "devtermo" | "cacadev" | "codebug" | "cruzadev";

export const GAME_LABELS: Record<GameId, string> = {
  devtermo: "DevTermo",
  cacadev: "Caça-Dev",
  codebug: "CodeBug",
  cruzadev: "CruzaDev",
};

export const ALL_GAME_IDS: GameId[] = ["devtermo", "cacadev", "codebug", "cruzadev"];
