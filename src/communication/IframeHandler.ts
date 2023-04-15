import { MessageHandler } from './MessageHandler';

export class IframeHandler {
  private connectionOpen = false;

  private connectionTimeout: NodeJS.Timeout | undefined = undefined;

  private iframe: WindowProxy;

  private messageHandler: MessageHandler;

  constructor(
    private readonly iframeId: string,
    private readonly iframeOrigin: string,
  ) {
    const element = document.getElementById(this.iframeId) as HTMLIFrameElement;

    if (!element || !element.contentWindow) {
      throw new Error(`Element with id ${this.iframeId} not found`);
    }

    this.iframe = element.contentWindow;

    this.messageHandler = new MessageHandler(this.sendMessage);
  }

  sendMessage = (message: { type: string; data?: any }) => {
    this.iframe.postMessage(JSON.stringify(message), this.iframeOrigin);
  };

  sendPing = () => {
    this.sendMessage({ type: 'ping' });

    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
    }

    this.connectionTimeout = setTimeout(() => {
      this.connectionOpen = false;
      this.sendPing();
    }, 2000);
  };

  onMessage = async (event: MessageEvent) => {
    if (event.origin !== this.iframeOrigin) {
      return;
    }

    try {
      const { type, data } = JSON.parse(event.data);

      if (type === 'pong') {
        this.connectionOpen = true;

        if (this.connectionOpen) {
          setTimeout(() => {
            this.sendPing();
          }, 1000);
        }
      } else {
        await this.messageHandler.handle(type, data);
      }
    } catch (e) {
      console.error('Message error', e);
    }
  };

  start() {
    window.addEventListener('message', this.onMessage);

    this.sendPing();
  }

  stop() {
    window.removeEventListener('message', this.onMessage);

    this.dispose();
  }

  private dispose() {
    this.connectionOpen = false;

    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
    }
  }
}
