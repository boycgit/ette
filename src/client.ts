import Application from './index';
import Request from './request';
import Response from './response';
import { SubscribeConfig, SubscribeManager, MESSAGE_TYPE } from './subscribe';
import { HTTP_METHOD, CONTENT_TYPE, invariant } from './lib';
const EventEmitter = require('wolfy87-eventemitter');

const METHODS_LOWERCASE: string[] = Object.keys(HTTP_METHOD).map(k =>
  HTTP_METHOD[k as any].toLowerCase()
);

export default class Client extends EventEmitter {
  domain: string;
  app: Application;
  manager: SubscribeManager;

  constructor(app?: Application) {
    super();
    invariant(!!app, 'param `app` should be exist');
    this.app = app as Application;
    this.domain = this.app.domain;
    this.manager = new SubscribeManager(this);
  }

  unsubscribe(path: string): boolean {
    return this.manager.unsubscribe(path);
  }

  hasSubscribe(path: string): boolean {
    return this.manager.hasSubscribe(path);
  }
}

METHODS_LOWERCASE.forEach(function(methodName) {
  Client.prototype[methodName] = function(
    path,
    data?: SubscribeConfig | any,
    type?: CONTENT_TYPE
  ) {
    const request = new Request({
      url: path,
      method: <HTTP_METHOD>methodName.toUpperCase(),
      type,
      data
    });

    request.host = this.domain; // 设置 domain

    // 如果是创建订阅，则需要进行订阅绑定，此时的 data 则当成 SubscribeConfig
    // 注意此时的 data.type 不在 message_type 里
    // 普通的 subscribe 请求是和原来的 get 处理过程一致的；
    if (request.method === HTTP_METHOD.SUBSCRIBE && !MESSAGE_TYPE[data.type]) {
      return this.manager.add(path, data);
    }

    return new Promise(resolve => {
      // 触发 ‘request’ 请求
      this.app.emit('request', request, ctx => {
        const res =
          (ctx && ctx.response) ||
          new Response({ body: { msg: 'ctx.response is not exist' } });
        resolve(res.toJSON());
      });
    });
  };
});

// Alias for `Client.delete()` because delete is a reserved word
Client.prototype['del'] = Client.prototype['delete'];
