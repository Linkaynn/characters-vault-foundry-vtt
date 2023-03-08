import { IframeHandler } from './communication/IframeHandler';
import { openIframeDialog } from './utils/openIframeDialog';

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

      handler.start();
    },
    onClose: () => {
      handler?.stop();
    },
  });
};
