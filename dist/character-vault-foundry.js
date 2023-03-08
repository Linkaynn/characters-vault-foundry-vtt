"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
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
class CharactersVaultMessageHandler {
  constructor(sendMessage) {
    this.sendMessage = sendMessage;
  }
  handle(type, data) {
    const actors = [...game.actors];
    if (type === "get-actors") {
      const actorsData = actors.map((a) => ({
        id: a.id,
        name: a.name,
        vtt: "foundry",
        data: a.data.data
      }));
      this.sendMessage({
        type: "actors",
        data: {
          vtt: "foundry",
          system: "AnimaBeyondFantasy",
          actors: actorsData
        }
      });
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
  }
}
class CharactersVaultIframeHandler {
  constructor(iframeId, iframeOrigin2) {
    __publicField(this, "connectionOpen", false);
    __publicField(this, "connectionTimeout");
    __publicField(this, "iframe");
    __publicField(this, "messageHandler");
    __publicField(this, "sendMessage", (message) => {
      this.iframe.postMessage(JSON.stringify(message), this.iframeOrigin);
    });
    __publicField(this, "sendPing", () => {
      this.sendMessage({ type: "ping" });
      if (this.connectionTimeout) {
        clearTimeout(this.connectionTimeout);
      }
      this.connectionTimeout = setTimeout(() => {
        this.connectionOpen = false;
        this.sendPing();
      }, 2e3);
    });
    __publicField(this, "onMessage", (event) => {
      if (event.origin !== this.iframeOrigin) {
        return;
      }
      try {
        const { type, data } = JSON.parse(event.data);
        if (type === "pong") {
          this.connectionOpen = true;
          if (this.connectionOpen) {
            setTimeout(() => {
              this.sendPing();
            }, 1e3);
          }
        } else {
          this.messageHandler.handle(type, data);
        }
      } catch (e) {
        console.error("Message error", e);
      }
    });
    this.iframeId = iframeId;
    this.iframeOrigin = iframeOrigin2;
    const element = document.getElementById(this.iframeId);
    if (!element || !element.contentWindow) {
      throw new Error(`Element with id ${this.iframeId} not found`);
    }
    this.iframe = element.contentWindow;
    this.messageHandler = new CharactersVaultMessageHandler(this.sendMessage);
  }
  start() {
    window.addEventListener("message", this.onMessage);
    this.sendPing();
  }
  stop() {
    window.removeEventListener("message", this.onMessage);
    this.dispose();
  }
  dispose() {
    this.connectionOpen = false;
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
    }
  }
}
const iframeOrigin = "http://localhost:3000";
const iframeSrc = "http://localhost:3000";
let handler;
openIframeDialog({
  src: iframeSrc,
  onOpen: () => {
    handler = new CharactersVaultIframeHandler(
      "characters-vault-iframe",
      iframeOrigin
    );
    handler.start();
  },
  onClose: () => {
    handler == null ? void 0 : handler.stop();
  }
});
