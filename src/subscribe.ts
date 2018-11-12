import Client from './client';
import { middlewareFunction } from './compose';
import { capitalize, invariant } from './lib';

export enum MESSAGE_TYPE {
  // OPEN = 'OPEN', // connect success，暂时没用到
  MESSAGE = 'MESSAGE', // normal send message
  // ERROR = 'ERROR', // occur error，暂时没用到
  // CLOSE = 'CLOSE' // close connection，暂时没用到
}

export type ClientMessageCallback = (data: any) => void;

export interface SubscribeConfig {
  onMessage?: ClientMessageCallback | middlewareFunction;
}

export const eventNameStandardize = path => `subscribe:${path}`;

export class ClientSender {
  client: Client;
  path: string;
  connected: boolean;
  constructor(client: Client, path: string) {
    this.client = client;
    this.path = path;
    this.connected = false;
  }
  connect(config: SubscribeConfig = {}) {
    // 给客户端绑定事件监听
    this.client.on(eventNameStandardize(this.path), function(ev) {
      const { type, data } = ev;
      const upperStr = type.toUpperCase();
      const methodName = `on${capitalize(type as any, true)}`;
      if (MESSAGE_TYPE[upperStr] && config[methodName]) {
        config[methodName](data);
      }
    });
    this.connected = true;
  }
  disconnect() {
    this.connected = false;
  }
  //  类似 ws.send， 相当于出发远程服务器的事件监听器
  send(message: any) {
    invariant(
      this.connected,
      `current client sender is disconnected (path: ${this.path})`
    );
    //  相当于调用本地的 subscribe 请求（类似普通的 get 请求，只不过有 type 和 data）
    return (this.client as any).subscribe(this.path, {
      type: MESSAGE_TYPE.MESSAGE,
      data: message
    });
  }
}

export class SubscribeManager {
  attaches: Map<string, ClientSender>;
  client: Client;
  constructor(client: Client) {
    this.attaches = new Map();
    this.client = client;
  }

  add(path, config: SubscribeConfig = {}) {
    let sender = this.attaches.get(path);

    if (!sender) {
      // 在本地注册事件监听器，方便服务端直接触发
      sender = new ClientSender(this.client, path);
    }

    // 根据 config 新建链接
    sender.connect(config);

    // 注册到 map
    this.attaches.set(path, sender);

    return sender;
  }
  unsubscribe(path): boolean {
    const sender = this.attaches.get(path);
    if (!!sender) {
      sender.disconnect();
    }
    return this.attaches.delete(path);
  }
  hasSubscribe(path): boolean {
    return !!this.attaches.get(path);
  }
}
