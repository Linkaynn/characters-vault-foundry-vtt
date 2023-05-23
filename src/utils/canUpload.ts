export const canUpload = (): boolean => {
  return !!game.user?.can('FILES_UPLOAD');
};
