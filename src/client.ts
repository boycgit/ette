import Application from './index';
import Request from './request';
import Response from './response';
import { HTTP_METHOD, CONTENT_TYPE, invariant } from './lib';
const EventEmitter = require('wolfy87-eventemitter');

const METHODS_LOWERCASE: string[] = Object.keys(HTTP_METHOD).map(k =>
  HTTP_METHOD[k as any].toLowerCase()
);

export default class Client extends EventEmitter {
  domain: string;
  app: Application;

  constructor(app?: Application) {
    super();
    invariant(!!app, 'param `app` should be exist');
    this.app = app as Application;
    this.domain = this.app.domain;
  }
}

METHODS_LOWERCASE.forEach(function(methodName) {
  Client.prototype[methodName] = function(path, type?: CONTENT_TYPE) {
    const request = new Request({
      url: path,
      method: <HTTP_METHOD>methodName.toUpperCase(),
      type
    });

    request.host = this.domain; // 设置 domain

    return new Promise(resolve => {
      // 触发 ‘request’ 请求
      this.app.emit('request', request, ctx => {
        const res =
          (ctx && ctx.response) ||
          new Response({ body: { msg: 'ctx.response is not exist'} });
        resolve(res.toJSON());
      });
    });
  };
});

// Alias for `Client.delete()` because delete is a reserved word
Client.prototype['del'] = Client.prototype['delete'];
