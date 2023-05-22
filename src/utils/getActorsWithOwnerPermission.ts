export const getActorsWithOwnerPermission = () => {
  if (game.actors) {
    return game.actors.filter((a) => a.permission === 3);
  }

  return [];
};
