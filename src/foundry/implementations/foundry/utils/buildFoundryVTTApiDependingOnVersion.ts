import { FoundryV9VTTApi } from '../FoundryV9VTTApi';
import { FoundryV10UpVTTApi } from '../FoundryV10UpVTTApi';
import { FoundryV12VTTApi } from '../FoundryV12VTTApi';

declare const game: {
  version: string;
};

export const getFoundryVersion = (): number => {
  return parseInt(game.version.split('.')[0]);
};

export const buildFoundryVTTApiDependingOnVersion = ():
  | FoundryV10UpVTTApi
  | FoundryV9VTTApi
  | FoundryV12VTTApi => {
  const version = getFoundryVersion();

  if (version === 9) {
    return new FoundryV9VTTApi();
  }

  if (version === 10 || version === 11) {
    return new FoundryV10UpVTTApi();
  }

  if (version === 12) {
    return new FoundryV12VTTApi();
  }

  throw new Error(`Foundry version ${version} is not supported`);
};
