import { IframeHandler } from './communication/IframeHandler';
import { openIframeDialog } from './utils/openIframeDialog';

const LAST_PATH_STORAGE_KEY = 'characters-vault-last-path';

const getLastPath = (): string => {
  try {
    return localStorage.getItem(LAST_PATH_STORAGE_KEY) || '';
  } catch {
    return '';
  }
};

const saveLastPath = (path: string): void => {
  try {
    localStorage.setItem(LAST_PATH_STORAGE_KEY, path);
  } catch {
    // Ignore storage errors
  }
};

export const start = ({
  iframeOrigin,
  iframeSrc,
}: {
  iframeOrigin: string;
  iframeSrc: string;
}) => {
  let handler: IframeHandler;

  openIframeDialog({
    src: iframeSrc,
    onOpen: () => {
      handler = new IframeHandler('characters-vault-iframe', iframeOrigin);

      handler.start().then(() => {
        // After connection established, send the last path to CV
        const lastPath = getLastPath();
        if (lastPath) {
          handler.navigateToPath(lastPath);
        }
      });
    },
    onClose: async () => {
      // Get current path from CV before closing
      if (handler) {
        const currentPath = await handler.getCurrentPath();
        if (currentPath) {
          saveLastPath(currentPath);
        }
        handler.stop();
      }
    },
  });
};
