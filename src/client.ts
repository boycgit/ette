import EventEmitter = require('wolfy87-eventemitter');
import Application from './index';
import Request from './request';

import { HTTP_METHOD, CONTENT_TYPE } from './lib';


const METHODS_LOWERCASE: string[] = Object.keys(HTTP_METHOD).map(k =>
  HTTP_METHOD[k as any].toLowerCase()
);

export default class Client extends EventEmitter {
  domain: string;
  app: Application;

  constructor(app: Application) {
    super();
    this.domain = app.domain;
    this.app = app;
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

    return new Promise((resolve) =>{
        this.app.emit('request', request, (ctx)=>{
            resolve(ctx.response.toJSON());
        }); // 触发 ‘request’ 请求
    });
  };
});

// Alias for `Client.delete()` because delete is a reserved word
Client.prototype['del'] = Client.prototype['delete'];
