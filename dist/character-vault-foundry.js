"use strict";
const defaultDialogOptions = {
  width: 1024,
  height: 720,
  classes: ["character-vault__iframe"]
};
const openIframeDialog = ({
  src,
  onOpen,
  onClose
}) => {
  return new Dialog(
    {
      title: "Characters Vault",
      content: `
  <style type='text/css'>
    .character-vault__iframe > .window-content > .dialog-buttons { display: none }
  </style>
  <div style="height: 100%;">
    <div style="position:relative;padding-top:66.5%;">
      <iframe
        id="character-vault-iframe"
        src="${src}"
        frameBorder="0"
        allowFullScreen
        style="position:absolute;top:0;left:0;width:100%;height:100%;"
      ></iframe>
    </div>
  </div>
`,
      buttons: {},
      default: "accept",
      render: () => {
        onOpen();
      },
      close: () => {
        onClose();
      }
    },
    defaultDialogOptions
  ).render(true);
};
const iframeOrigin = "http://localhost:3000";
const iframeSrc = "http://localhost:3000";
let dialogOpened = false;
let connectionOpen = false;
let connectionTimeout = void 0;
const getIframe = () => {
  const iframe = document.getElementById(
    "character-vault-iframe"
  );
  if (!iframe || !dialogOpened || !iframe.contentWindow) {
    throw new Error("Characters Vault unavailable");
  }
  return iframe.contentWindow;
};
const sendPing = () => {
  getIframe().postMessage(JSON.stringify({ type: "ping" }), iframeOrigin);
  if (connectionTimeout) {
    clearTimeout(connectionTimeout);
  }
  connectionTimeout = setTimeout(() => {
    connectionOpen = false;
    sendPing();
  }, 2e3);
};
const onMessage = (event) => {
  if (event.origin !== iframeOrigin) {
    return;
  }
  try {
    const { type, data } = JSON.parse(event.data);
    if (type === "pong") {
      connectionOpen = true;
      if (connectionOpen && dialogOpened) {
        setTimeout(() => {
          sendPing();
        }, 1e3);
      }
    }
    const actors = [...game.actors];
    if (type === "get-actors") {
      const actorsData = actors.map((a) => ({
        id: a.id,
        name: a.name,
        vtt: "foundry",
        data: a.data.data
      }));
      getIframe().postMessage(
        JSON.stringify({
          type: "actors",
          data: {
            vtt: "foundry",
            system: "AnimaBeyondFantasy",
            actors: actorsData
          }
        }),
        iframeOrigin
      );
    }
    if (type === "update-actor") {
      const newActor = data.actor;
      const actions = data.actions;
      const actor = actors.find((a) => a.id === newActor.id);
      if (actor) {
        actor.update({
          name: newActor.name,
          data: newActor.data
        });
        for (const action of actions) {
          if (action.type === "delete" && action.ids.length > 0) {
            actor.deleteEmbeddedDocuments("Item", action.ids);
          }
          if (action.type === "create" && action.data.length > 0) {
            actor.createEmbeddedDocuments(
              "Item",
              action.data.map((d) => ({
                type: d.type,
                name: d.name,
                data: d.data
              }))
            );
          }
        }
      }
    }
  } catch (e) {
    console.error("Message error", e);
  }
};
openIframeDialog({
  src: iframeSrc,
  onOpen: () => {
    dialogOpened = true;
    window.addEventListener("message", onMessage);
    sendPing();
  },
  onClose: () => {
    dialogOpened = false;
    connectionOpen = false;
    if (connectionTimeout) {
      clearTimeout(connectionTimeout);
    }
    window.removeEventListener("message", onMessage);
  }
});
