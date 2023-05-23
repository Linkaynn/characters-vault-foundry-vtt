"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var MessageType;
(function(MessageType2) {
  MessageType2["Call"] = "call";
  MessageType2["Reply"] = "reply";
  MessageType2["Syn"] = "syn";
  MessageType2["SynAck"] = "synAck";
  MessageType2["Ack"] = "ack";
})(MessageType || (MessageType = {}));
var Resolution;
(function(Resolution2) {
  Resolution2["Fulfilled"] = "fulfilled";
  Resolution2["Rejected"] = "rejected";
})(Resolution || (Resolution = {}));
var ErrorCode;
(function(ErrorCode2) {
  ErrorCode2["ConnectionDestroyed"] = "ConnectionDestroyed";
  ErrorCode2["ConnectionTimeout"] = "ConnectionTimeout";
  ErrorCode2["NoIframeSrc"] = "NoIframeSrc";
})(ErrorCode || (ErrorCode = {}));
var NativeErrorName;
(function(NativeErrorName2) {
  NativeErrorName2["DataCloneError"] = "DataCloneError";
})(NativeErrorName || (NativeErrorName = {}));
var NativeEventType;
(function(NativeEventType2) {
  NativeEventType2["Message"] = "message";
})(NativeEventType || (NativeEventType = {}));
const createDestructor = (localName, log) => {
  const callbacks = [];
  let destroyed = false;
  return {
    destroy(error) {
      if (!destroyed) {
        destroyed = true;
        log(`${localName}: Destroying connection`);
        callbacks.forEach((callback) => {
          callback(error);
        });
      }
    },
    onDestroy(callback) {
      destroyed ? callback() : callbacks.push(callback);
    }
  };
};
const createLogger = (debug) => {
  return (...args) => {
    if (debug) {
      console.log("[Penpal]", ...args);
    }
  };
};
const DEFAULT_PORT_BY_PROTOCOL = {
  "http:": "80",
  "https:": "443"
};
const URL_REGEX = /^(https?:)?\/\/([^/:]+)?(:(\d+))?/;
const opaqueOriginSchemes = ["file:", "data:"];
const getOriginFromSrc = (src) => {
  if (src && opaqueOriginSchemes.find((scheme) => src.startsWith(scheme))) {
    return "null";
  }
  const location = document.location;
  const regexResult = URL_REGEX.exec(src);
  let protocol;
  let hostname;
  let port;
  if (regexResult) {
    protocol = regexResult[1] ? regexResult[1] : location.protocol;
    hostname = regexResult[2];
    port = regexResult[4];
  } else {
    protocol = location.protocol;
    hostname = location.hostname;
    port = location.port;
  }
  const portSuffix = port && port !== DEFAULT_PORT_BY_PROTOCOL[protocol] ? `:${port}` : "";
  return `${protocol}//${hostname}${portSuffix}`;
};
const serializeError = ({ name, message, stack }) => ({
  name,
  message,
  stack
});
const deserializeError = (obj) => {
  const deserializedError = new Error();
  Object.keys(obj).forEach((key) => deserializedError[key] = obj[key]);
  return deserializedError;
};
const connectCallReceiver = (info, serializedMethods, log) => {
  const { localName, local, remote, originForSending, originForReceiving } = info;
  let destroyed = false;
  const handleMessageEvent = (event) => {
    if (event.source !== remote || event.data.penpal !== MessageType.Call) {
      return;
    }
    if (originForReceiving !== "*" && event.origin !== originForReceiving) {
      log(`${localName} received message from origin ${event.origin} which did not match expected origin ${originForReceiving}`);
      return;
    }
    const callMessage = event.data;
    const { methodName, args, id: id2 } = callMessage;
    log(`${localName}: Received ${methodName}() call`);
    const createPromiseHandler = (resolution) => {
      return (returnValue) => {
        log(`${localName}: Sending ${methodName}() reply`);
        if (destroyed) {
          log(`${localName}: Unable to send ${methodName}() reply due to destroyed connection`);
          return;
        }
        const message = {
          penpal: MessageType.Reply,
          id: id2,
          resolution,
          returnValue
        };
        if (resolution === Resolution.Rejected && returnValue instanceof Error) {
          message.returnValue = serializeError(returnValue);
          message.returnValueIsError = true;
        }
        try {
          remote.postMessage(message, originForSending);
        } catch (err) {
          if (err.name === NativeErrorName.DataCloneError) {
            const errorReplyMessage = {
              penpal: MessageType.Reply,
              id: id2,
              resolution: Resolution.Rejected,
              returnValue: serializeError(err),
              returnValueIsError: true
            };
            remote.postMessage(errorReplyMessage, originForSending);
          }
          throw err;
        }
      };
    };
    new Promise((resolve) => resolve(serializedMethods[methodName].apply(serializedMethods, args))).then(createPromiseHandler(Resolution.Fulfilled), createPromiseHandler(Resolution.Rejected));
  };
  local.addEventListener(NativeEventType.Message, handleMessageEvent);
  return () => {
    destroyed = true;
    local.removeEventListener(NativeEventType.Message, handleMessageEvent);
  };
};
let id = 0;
const generateId = () => ++id;
const KEY_PATH_DELIMITER = ".";
const keyPathToSegments = (keyPath) => keyPath ? keyPath.split(KEY_PATH_DELIMITER) : [];
const segmentsToKeyPath = (segments) => segments.join(KEY_PATH_DELIMITER);
const createKeyPath = (key, prefix) => {
  const segments = keyPathToSegments(prefix || "");
  segments.push(key);
  return segmentsToKeyPath(segments);
};
const setAtKeyPath = (subject, keyPath, value) => {
  const segments = keyPathToSegments(keyPath);
  segments.reduce((prevSubject, key, idx) => {
    if (typeof prevSubject[key] === "undefined") {
      prevSubject[key] = {};
    }
    if (idx === segments.length - 1) {
      prevSubject[key] = value;
    }
    return prevSubject[key];
  }, subject);
  return subject;
};
const serializeMethods = (methods, prefix) => {
  const flattenedMethods = {};
  Object.keys(methods).forEach((key) => {
    const value = methods[key];
    const keyPath = createKeyPath(key, prefix);
    if (typeof value === "object") {
      Object.assign(flattenedMethods, serializeMethods(value, keyPath));
    }
    if (typeof value === "function") {
      flattenedMethods[keyPath] = value;
    }
  });
  return flattenedMethods;
};
const deserializeMethods = (flattenedMethods) => {
  const methods = {};
  for (const keyPath in flattenedMethods) {
    setAtKeyPath(methods, keyPath, flattenedMethods[keyPath]);
  }
  return methods;
};
const connectCallSender = (callSender, info, methodKeyPaths, destroyConnection, log) => {
  const { localName, local, remote, originForSending, originForReceiving } = info;
  let destroyed = false;
  log(`${localName}: Connecting call sender`);
  const createMethodProxy = (methodName) => {
    return (...args) => {
      log(`${localName}: Sending ${methodName}() call`);
      let iframeRemoved;
      try {
        if (remote.closed) {
          iframeRemoved = true;
        }
      } catch (e) {
        iframeRemoved = true;
      }
      if (iframeRemoved) {
        destroyConnection();
      }
      if (destroyed) {
        const error = new Error(`Unable to send ${methodName}() call due to destroyed connection`);
        error.code = ErrorCode.ConnectionDestroyed;
        throw error;
      }
      return new Promise((resolve, reject) => {
        const id2 = generateId();
        const handleMessageEvent = (event) => {
          if (event.source !== remote || event.data.penpal !== MessageType.Reply || event.data.id !== id2) {
            return;
          }
          if (originForReceiving !== "*" && event.origin !== originForReceiving) {
            log(`${localName} received message from origin ${event.origin} which did not match expected origin ${originForReceiving}`);
            return;
          }
          const replyMessage = event.data;
          log(`${localName}: Received ${methodName}() reply`);
          local.removeEventListener(NativeEventType.Message, handleMessageEvent);
          let returnValue = replyMessage.returnValue;
          if (replyMessage.returnValueIsError) {
            returnValue = deserializeError(returnValue);
          }
          (replyMessage.resolution === Resolution.Fulfilled ? resolve : reject)(returnValue);
        };
        local.addEventListener(NativeEventType.Message, handleMessageEvent);
        const callMessage = {
          penpal: MessageType.Call,
          id: id2,
          methodName,
          args
        };
        remote.postMessage(callMessage, originForSending);
      });
    };
  };
  const flattenedMethods = methodKeyPaths.reduce((api, name) => {
    api[name] = createMethodProxy(name);
    return api;
  }, {});
  Object.assign(callSender, deserializeMethods(flattenedMethods));
  return () => {
    destroyed = true;
  };
};
const handleAckMessageFactory = (serializedMethods, childOrigin, originForSending, destructor, log) => {
  const { destroy, onDestroy } = destructor;
  let destroyCallReceiver;
  let receiverMethodNames;
  const callSender = {};
  return (event) => {
    if (childOrigin !== "*" && event.origin !== childOrigin) {
      log(`Parent: Handshake - Received ACK message from origin ${event.origin} which did not match expected origin ${childOrigin}`);
      return;
    }
    log("Parent: Handshake - Received ACK");
    const info = {
      localName: "Parent",
      local: window,
      remote: event.source,
      originForSending,
      originForReceiving: childOrigin
    };
    if (destroyCallReceiver) {
      destroyCallReceiver();
    }
    destroyCallReceiver = connectCallReceiver(info, serializedMethods, log);
    onDestroy(destroyCallReceiver);
    if (receiverMethodNames) {
      receiverMethodNames.forEach((receiverMethodName) => {
        delete callSender[receiverMethodName];
      });
    }
    receiverMethodNames = event.data.methodNames;
    const destroyCallSender = connectCallSender(callSender, info, receiverMethodNames, destroy, log);
    onDestroy(destroyCallSender);
    return callSender;
  };
};
const handleSynMessageFactory = (log, serializedMethods, childOrigin, originForSending) => {
  return (event) => {
    if (!event.source) {
      return;
    }
    if (childOrigin !== "*" && event.origin !== childOrigin) {
      log(`Parent: Handshake - Received SYN message from origin ${event.origin} which did not match expected origin ${childOrigin}`);
      return;
    }
    log("Parent: Handshake - Received SYN, responding with SYN-ACK");
    const synAckMessage = {
      penpal: MessageType.SynAck,
      methodNames: Object.keys(serializedMethods)
    };
    event.source.postMessage(synAckMessage, originForSending);
  };
};
const CHECK_IFRAME_IN_DOC_INTERVAL = 6e4;
const monitorIframeRemoval = (iframe, destructor) => {
  const { destroy, onDestroy } = destructor;
  const checkIframeInDocIntervalId = setInterval(() => {
    if (!iframe.isConnected) {
      clearInterval(checkIframeInDocIntervalId);
      destroy();
    }
  }, CHECK_IFRAME_IN_DOC_INTERVAL);
  onDestroy(() => {
    clearInterval(checkIframeInDocIntervalId);
  });
};
const startConnectionTimeout = (timeout, callback) => {
  let timeoutId;
  if (timeout !== void 0) {
    timeoutId = window.setTimeout(() => {
      const error = new Error(`Connection timed out after ${timeout}ms`);
      error.code = ErrorCode.ConnectionTimeout;
      callback(error);
    }, timeout);
  }
  return () => {
    clearTimeout(timeoutId);
  };
};
const validateIframeHasSrcOrSrcDoc = (iframe) => {
  if (!iframe.src && !iframe.srcdoc) {
    const error = new Error("Iframe must have src or srcdoc property defined.");
    error.code = ErrorCode.NoIframeSrc;
    throw error;
  }
};
const connectToChild = (options) => {
  let { iframe, methods = {}, childOrigin, timeout, debug = false } = options;
  const log = createLogger(debug);
  const destructor = createDestructor("Parent", log);
  const { onDestroy, destroy } = destructor;
  if (!childOrigin) {
    validateIframeHasSrcOrSrcDoc(iframe);
    childOrigin = getOriginFromSrc(iframe.src);
  }
  const originForSending = childOrigin === "null" ? "*" : childOrigin;
  const serializedMethods = serializeMethods(methods);
  const handleSynMessage = handleSynMessageFactory(log, serializedMethods, childOrigin, originForSending);
  const handleAckMessage = handleAckMessageFactory(serializedMethods, childOrigin, originForSending, destructor, log);
  const promise = new Promise((resolve, reject) => {
    const stopConnectionTimeout = startConnectionTimeout(timeout, destroy);
    const handleMessage = (event) => {
      if (event.source !== iframe.contentWindow || !event.data) {
        return;
      }
      if (event.data.penpal === MessageType.Syn) {
        handleSynMessage(event);
        return;
      }
      if (event.data.penpal === MessageType.Ack) {
        const callSender = handleAckMessage(event);
        if (callSender) {
          stopConnectionTimeout();
          resolve(callSender);
        }
        return;
      }
    };
    window.addEventListener(NativeEventType.Message, handleMessage);
    log("Parent: Awaiting handshake");
    monitorIframeRemoval(iframe, destructor);
    onDestroy((error) => {
      window.removeEventListener(NativeEventType.Message, handleMessage);
      if (error) {
        reject(error);
      }
    });
  });
  return {
    promise,
    destroy() {
      destroy();
    }
  };
};
const getActorsWithOwnerPermission = () => {
  if (game.actors) {
    return game.actors.filter((a) => a.permission === 3);
  }
  return [];
};
const getUser = () => {
  return game.user;
};
const dataURLtoFile = (dataUrl, filename) => {
  var _a;
  const arr = dataUrl.split(",");
  const mime = (_a = arr[0].match(/:(.*?);/)) == null ? void 0 : _a[1];
  const bstr = atob(arr[arr.length - 1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};
const createFolder = async (folderPath) => {
  const folders = folderPath.split("/");
  let currentFolder = "";
  for (const folder of folders) {
    currentFolder += `${folder}/`;
    try {
      await FilePicker.createDirectory("data", currentFolder);
    } catch (e) {
      console.log(e);
    }
  }
};
const uploadCharacterToken = async (tokenAsBase64, actor) => {
  const tokenFolderPath = `characters-vault/${getUser().id}`;
  const file = dataURLtoFile(tokenAsBase64, `${actor.id}.png`);
  await createFolder(tokenFolderPath);
  const uploadResult = await FilePicker.upload("data", tokenFolderPath, file);
  if (uploadResult) {
    const r = uploadResult;
    return { path: r.path };
  } else {
    console.log(uploadResult);
    throw new Error("Error uploading token");
  }
};
const canUpload = () => {
  var _a;
  return !!((_a = game.user) == null ? void 0 : _a.can("FILES_UPLOAD"));
};
class IframeHandler {
  constructor(iframeId, iframeOrigin2) {
    __publicField(this, "connection");
    __publicField(this, "getActors", async () => {
      const actors = [...getActorsWithOwnerPermission()];
      return actors.map(this.buildFoundryActorData);
    });
    __publicField(this, "createActor", async () => {
      const newActor = await Actor.create({
        name: "Dummy actor (Characters Vault)",
        type: "character"
      });
      if (!newActor) {
        throw new Error("Error creating actor");
      }
      return this.buildFoundryActorData(newActor);
    });
    __publicField(this, "updateActor", async ({
      actor,
      tokenAsBase64,
      actions,
      isNew
    }) => {
      var _a, _b, _c;
      let tokenPath;
      if (tokenAsBase64) {
        if (canUpload()) {
          tokenPath = (_a = await uploadCharacterToken(tokenAsBase64, actor)) == null ? void 0 : _a.path;
        } else {
          (_b = ui.notifications) == null ? void 0 : _b.warn(
            "No tienes permisos para subir los tokens de los personajes. Pídele a tu GM que lo haga por ti."
          );
        }
      }
      const actors = [...getActorsWithOwnerPermission()];
      const actorToBeUpdated = actors.find((a) => a.id === actor.id);
      if (actorToBeUpdated) {
        await actorToBeUpdated.update({
          img: tokenPath,
          name: actor.name,
          data: actor.data,
          token: {
            img: tokenPath,
            name: isNew ? actor.name : (_c = actorToBeUpdated.token) == null ? void 0 : _c.name
          },
          flags: {
            ...actorToBeUpdated.data.flags,
            ...actor.flags
          }
        });
        for (const action of actions) {
          if (action.type === "delete" && action.ids.length > 0) {
            await actorToBeUpdated.deleteEmbeddedDocuments("Item", action.ids);
          }
          if (action.type === "create" && action.data.length > 0) {
            await actorToBeUpdated.createEmbeddedDocuments(
              "Item",
              action.data.map((d) => ({
                type: d.type,
                name: d.name,
                data: d.data,
                flags: d.flags
              }))
            );
          }
        }
      }
    });
    __publicField(this, "buildFoundryActorData", (actor) => ({
      id: actor.id,
      name: actor.name ?? "Unknown",
      vtt: "foundry",
      data: actor.data.data,
      flags: actor.data.flags
    }));
    this.iframeId = iframeId;
    this.iframeOrigin = iframeOrigin2;
    const element = document.getElementById(this.iframeId);
    if (!element || !element.contentWindow) {
      throw new Error(`Element with id ${this.iframeId} not found`);
    }
    this.connection = connectToChild({
      iframe: element,
      childOrigin: this.iframeOrigin,
      methods: {
        createActor: this.createActor,
        updateActor: this.updateActor,
        getActors: this.getActors
      }
    });
  }
  async start() {
    await this.connection.promise;
  }
  stop() {
    this.dispose();
  }
  dispose() {
    var _a;
    (_a = this.connection) == null ? void 0 : _a.destroy();
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
const iframeOrigin = "http://localhost:3000";
const iframeSrc = "http://localhost:3000";
start({
  iframeOrigin,
  iframeSrc
});
