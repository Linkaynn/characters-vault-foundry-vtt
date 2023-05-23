export {};

declare global {
  class ABFFoundryRoll extends Roll {}

  const game: Game & { user: User };
}
