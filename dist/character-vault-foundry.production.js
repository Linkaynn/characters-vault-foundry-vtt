"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var _a;
const getActorsWithOwnerPermission = () => {
  if (game.actors) {
    return game.actors.filter((a) => a.permission === 3);
  }
  return [];
};
const IAmAGM = ((_a = game.user) == null ? void 0 : _a.isGM) === true;
class MessageHandler {
  constructor(sendMessage) {
    this.sendMessage = sendMessage;
  }
  async handle(type, data) {
    const actors = [...getActorsWithOwnerPermission()];
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
    if (IAmAGM) {
      if (type === "new-actor") {
        const actor = await Actor.create({
          name: "Dummy actor (Characters Vault)",
          type: "character"
        });
        if (!actor) {
          console.error("Error creating actor");
          return;
        }
        this.sendMessage({
          type: "new-actor",
          data: {
            id: actor.id,
            name: actor.name,
            vtt: "foundry",
            data: actor.data.data
          }
        });
      }
    }
    if (type === "update-actor") {
      const newActor = data.actor;
      const actions = data.actions;
      const actor = actors.find((a) => a.id === newActor.id);
      if (actor) {
        this.updateActor(actor, newActor, actions);
      }
    }
  }
  updateActor(actor, newActor, actions) {
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
class IframeHandler {
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
    __publicField(this, "onMessage", async (event) => {
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
          await this.messageHandler.handle(type, data);
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
    this.messageHandler = new MessageHandler(this.sendMessage);
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
const defaultDialogOptions = {
  width: 1250,
  height: 850,
  classes: ["characters-vault__iframe"]
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
const start = ({
  iframeOrigin: iframeOrigin2,
  iframeSrc: iframeSrc2
}) => {
  let handler;
  openIframeDialog({
    src: iframeSrc2,
    onOpen: () => {
      handler = new IframeHandler("characters-vault-iframe", iframeOrigin2);
      handler.start();
    },
    onClose: () => {
      handler == null ? void 0 : handler.stop();
    }
  });
};
const iframeOrigin = "https://app.charactersvault.com";
const iframeSrc = "https://app.charactersvault.com";
start({
  iframeOrigin,
  iframeSrc
});
