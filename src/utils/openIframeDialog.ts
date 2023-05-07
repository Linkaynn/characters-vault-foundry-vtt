const defaultDialogOptions = {
  width: 1250,
  height: 850,
  classes: ['characters-vault__iframe'],
};

export const openIframeDialog = ({
  src,
  onOpen,
  onClose,
}: {
  src: string;
  onOpen: () => void;
  onClose: () => void;
}) => {
  return new Dialog(
    {
      title: 'Characters Vault',
      content: `
  <style type='text/css'>
    .characters-vault__iframe > .window-content > .dialog-buttons { display: none }
  </style>
  <div style="height: 100%;">
    <div style="position:relative;padding-top:66.5%;">
      <iframe
        id="characters-vault-iframe"
        src="${src}"
        frameBorder="0"
        allowFullScreen
        style="position:absolute;top:0;left:0;width:100%;height:100%;"
      ></iframe>
    </div>
  </div>
`,
      buttons: {},
      default: 'accept',
      render: () => {
        onOpen();
      },
      close: () => {
        onClose();
      },
    },
    defaultDialogOptions,
  ).render(true);
};
