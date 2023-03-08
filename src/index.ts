import { openIframeDialog } from './utils/openIframeDialog';

export {};

const iframeOrigin = 'http://localhost:3000';
const iframeSrc = 'http://localhost:3000';

let dialogOpened = false;

let connectionOpen = false;
let connectionTimeout: NodeJS.Timeout | undefined = undefined;

const getIframe = () => {
  const iframe = document.getElementById(
    'character-vault-iframe',
  ) as HTMLIFrameElement;

  if (!iframe || !dialogOpened || !iframe.contentWindow) {
    throw new Error('Characters Vault unavailable');
  }

  return iframe.contentWindow;
};

const sendPing = () => {
  getIframe().postMessage(JSON.stringify({ type: 'ping' }), iframeOrigin);

  if (connectionTimeout) {
    clearTimeout(connectionTimeout);
  }

  connectionTimeout = setTimeout(() => {
    connectionOpen = false;
    sendPing();
  }, 2000);
};

const onMessage = (event: MessageEvent) => {
  if (event.origin !== iframeOrigin) {
    return;
  }

  try {
    const { type, data } = JSON.parse(event.data);

    if (type === 'pong') {
      connectionOpen = true;

      if (connectionOpen && dialogOpened) {
        setTimeout(() => {
          sendPing();
        }, 1000);
      }
    }

    const actors = [...game.actors];

    if (type === 'get-actors') {
      const actorsData = actors.map((a) => ({
        id: a.id,
        name: a.name,
        vtt: 'foundry',
        data: a.data.data,
      }));

      getIframe().postMessage(
        JSON.stringify({
          type: 'actors',
          data: {
            vtt: 'foundry',
            system: 'AnimaBeyondFantasy',
            actors: actorsData,
          },
        }),
        iframeOrigin,
      );
    }

    if (type === 'update-actor') {
      const newActor = data.actor;
      const actions = data.actions;

      const actor = actors.find((a) => a.id === newActor.id);

      if (actor) {
        actor.update({
          name: newActor.name,

          data: newActor.data,
        });

        for (const action of actions) {
          if (action.type === 'delete' && action.ids.length > 0) {
            actor.deleteEmbeddedDocuments('Item', action.ids);
          }

          if (action.type === 'create' && action.data.length > 0) {
            actor.createEmbeddedDocuments(
              'Item',
              action.data.map((d: any) => ({
                type: d.type,
                name: d.name,
                data: d.data,
              })),
            );
          }
        }
      }
    }
  } catch (e) {
    console.error('Message error', e);
  }
};

openIframeDialog({
  src: iframeSrc,
  onOpen: () => {
    dialogOpened = true;

    window.addEventListener('message', onMessage);

    sendPing();
  },
  onClose: () => {
    dialogOpened = false;
    connectionOpen = false;

    if (connectionTimeout) {
      clearTimeout(connectionTimeout);
    }

    window.removeEventListener('message', onMessage);
  },
});