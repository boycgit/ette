import EventEmitter = require('wolfy87-eventemitter');
import compose, { middlewareFunction } from './compose';
import { uuid, invariant } from './lib';
import Request from './request';
import Response from './response';
import Client from './client';

interface AppConfig {
  domain?: string;
}

export default class Application extends EventEmitter {
  domain: string;
  middleware: middlewareFunction[];
  context: object;
  request: Request;
  response: Response;
  emitters: EventEmitter;
  _client: Client;

  constructor(config?: AppConfig) {
    super();
    const { domain = '' } = config || {};
    this.domain = domain || uuid(8, 16).toLowerCase(); // 16 位进制，8 位字符
    this.middleware = [];
    this.context = {};
    this.response = new Response();
    this._client = new Client(this);
  }

  get client() {
    return this._client;
  }

  use(fn: middlewareFunction) {
    invariant(typeof fn === 'function', 'middleware must be a function!');
    this.middleware.push(fn);
    return this;
  }

  // 在当前对象上监听 `request` 事件
  listen() {
    this.on('request', this.callback());
  }

  /**
   * Return a request handler callback
   * for node's native http server.
   *
   * @return {Function}
   * @api public
   */
  callback() {
    // 对中间件数组进行组合成串行函数，依次执行
    const fn = compose(this.middleware);
    if (!this.getListeners('error').length) this.on('error', this.onerror);

    return (req: Request, lastMiddleware: middlewareFunction) => {
      const ctx = this.createContext(req);
      return this.handleRequest(ctx, fn, lastMiddleware);
    };
  }

  /**
   * Handle request in callback.
   * generally  call lastMiddleware function to send response，please refer `client.ts` for more detail
   * @api private
   */

  handleRequest(ctx, fnMiddleware, lastMiddleware: middlewareFunction) {
    const response = ctx.response;
    response.statusCode = 404;
    return fnMiddleware(ctx)
      .then(lastMiddleware)
      .catch(this.onerror);
  }

  /**
   * Initialize a new context per request
   * and store req as attr to context
   * @param {*} req
   * @returns
   * @memberof Application
   */
  createContext(req: Request) {
    const context = Object.create(this.context);
    const request = (context.request = Object.create(req));
    const response = (context.response = Object.create(this.response));
    context.app = request.app = response.app = this;
    context.req = request.req = response.req = req;
    request.ctx = response.ctx = context;
    request.response = response;
    response.request = request;
    return context;
  }

  /**
   * Default error handler.
   *
   * @param {Error} err
   * @api private
   */

  onerror(err) {
    invariant(err instanceof Error, `non-error thrown: ${err}`);

    if (404 == err.status || err.expose) return;

    const msg = err.stack || err.toString();
    console.error();
    console.error(msg.replace(/^/gm, '  '));
    console.error();

    // 触发error事件
    this.emit('error', err);
  }
}
