import { openIframeDialog } from './utils/openIframeDialog';
import { CharactersVaultIframeHandler } from './CharactersVaultIframeHandler';

const iframeOrigin = 'http://localhost:3000';
const iframeSrc = 'http://localhost:3000';

let handler: CharactersVaultIframeHandler;

openIframeDialog({
  src: iframeSrc,
  onOpen: () => {
    handler = new CharactersVaultIframeHandler(
      'characters-vault-iframe',
      iframeOrigin,
    );

    handler.start();
  },
  onClose: () => {
    handler?.stop();
  },
});

export {};
