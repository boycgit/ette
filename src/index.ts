import EventEmitter = require('wolfy87-eventemitter');
import compose, { middlewareFunction } from './compose';
import { uuid, invariant } from './lib';
import Request from './request';
import Response from './response';

export default class Application extends EventEmitter {
  domain: string;
  middleware: middlewareFunction[];
  context: object;
  request: Request;
  response: Response;
  emitters: EventEmitter;

  constructor({ domain }) {
    super();
    this.domain = domain || uuid(8, 16); // 16 位进制，8 位字符
    this.middleware = [];
    this.context = {};
    this.request = new Request();
    this.response = new Response();
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

    return (req, onData) => {
      const ctx = this.createContext(req);
      return this.handleRequest(ctx, fn, onData);
    };
  }

  /**
   * Handle request in callback.
   *
   * @api private
   */

  handleRequest(ctx, fnMiddleware, onData?) {
    const response = ctx.response;
    response.statusCode = 404;
    const handleResponse = onData? onData : () => respond(ctx);
    return fnMiddleware(ctx)
      .then(handleResponse)
      .catch(this.onerror);
  }

  /**
   * Initialize a new context per request
   * and store req as attr to context
   * @param {*} req
   * @returns
   * @memberof Application
   */
  createContext(req) {
    const context = Object.create(this.context);
    const request = (context.request = Object.create(this.request));
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

  onerror(err, ctx) {
    invariant(err instanceof Error, `non-error thrown: ${err}`);

    if (404 == err.status || err.expose) return;

    const msg = err.stack || err.toString();
    console.error();
    console.error(msg.replace(/^/gm, '  '));
    console.error();

    // 触发error事件
    this.emit('error', err);
    ctx.response.body = err; // 设置 body 内容
  }
}

/**
 * Response helper.
 */

function respond(ctx) {
  const { request, response } = ctx;
  console.log(`request ${request.url}, get response: ${response.toJSON()}`);
}
