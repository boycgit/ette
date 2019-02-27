import { compose, middlewareFunction } from './compose';
import {
  uuid,
  invariant,
  HTTP_METHOD,
  capitalize,
  createInstanceofPredicate
} from './lib';
import { Request } from './request';
import { Response } from './response';
import { Client } from './client';
import {
  eventNameStandardize,
  MESSAGE_TYPE,
  SubscribeConfig
} from './subscribe';

const EventEmitter = require('wolfy87-eventemitter');
interface AppConfig {
  domain?: string;
  autoListen?: boolean;
}

export * from './request';
export * from './Response';
export * from './client';
export * from './compose';

export interface IContext {
  app: Application;
  req: Request;
  res: Response;
  request: Request;
  response: Response;
  [propName: string]: any;
}

export default class Application extends EventEmitter {
  domain: string;
  middleware: middlewareFunction[];
  context: Record<string, any>;
  request: Request;
  response: Response;
  _client: Client;
  _subs: Map<string, SubscribeConfig>;

  constructor(config?: AppConfig) {
    super();
    const { autoListen = true } = config || {};
    this.domain = (config && config.domain) || uuid(8, 16).toLowerCase(); // 不传入的话，默认 16 位进制，8 位字符
    this.middleware = [];
    this.context = {};
    this.response = new Response();
    this._client = new Client(this);

    this._subs = new Map();

    if (autoListen) {
      this.listen(); // 默认开启监听
    }
  }

  get client(): Client {
    return this._client;
  }

  use = (fn: middlewareFunction) => {
    invariant(typeof fn === 'function', 'middleware must be a function!');
    this.middleware.push(fn);
    return this;
  };

  // 在当前对象上监听 `request`、`error` 等事件
  listen = () => {
    this.on('request', this.callback());
    if (!this.getListeners('error').length) this.on('error', this.onerror);
  };

  // 注册针对某个路径的监听器，注意针对某个 subscribe 只能有一项配置项
  subscribe(path: string, config: SubscribeConfig = {}) {
    if (!!path && !!config) {
      this._subs.set(path, config);
    }
  }

  hasSubscribe(path): boolean {
    return !!this._subs.get(path);
  }

  unsubscribe(path: string) {
    return this._subs.delete(path);
  }

  // 服务端针对某个路径发送消息
  send = (path: string, message: any) => {
    this.client.emit(eventNameStandardize(path), {
      type: MESSAGE_TYPE.MESSAGE,
      data: message
    });
  };

  /**
   * Return a request handler callback
   * for node's native http server.
   *
   * @return {Function}
   * @api public
   */
  callback = () => {
    // 对中间件数组进行组合成串行函数，依次执行
    const fn = compose(this.middleware);
    return (req: Request, lastMiddleware: middlewareFunction) => {
      const ctx = this.createContext(req);

      let middles = fn;
      const config = this._subs.get(req.path);

      // 如果是 subscribe 场景，提取出 config 中的 `onMessage` 等具体函数
      if (
        req.method === HTTP_METHOD.SUBSCRIBE &&
        config &&
        req.data &&
        req.data.type
      ) {
        const type = req.data.type;
        const upperStr = type.toUpperCase();
        const methodName = `on${capitalize(upperStr as any, true)}`;
        if (typeof config[methodName] === 'function') {
          middles = compose([fn, config[methodName]]);
        }
      }
      return this.handleRequest(ctx, middles, lastMiddleware);
    };
  };

  /**
   * Handle request in callback.
   * generally  call lastMiddleware function to send response，please refer `client.ts` for more detail
   * 如果是 subscribe 请求，则 response 请求是有规范的
   *
   * @api private
   */

  handleRequest = (
    ctx: IContext,
    fnMiddleware,
    lastMiddleware: middlewareFunction
  ) => {
    const response = ctx.response;
    response.status = 404;
    return fnMiddleware(ctx)
      .then(() => {
        return lastMiddleware(ctx);
      })
      .catch(this.onerror);
  };

  /**
   * Initialize a new context per request
   * and store req as attr to context
   * @param {*} req
   * @returns
   * @memberof Application
   */
  createContext = (req: Request): IContext => {
    const context = Object.create(this.context);
    const request = (context.request = Object.create(req));
    const response = (context.response = Object.create(this.response));
    context.app = request.app = response.app = this;
    context.req = request.req = response.req = req;
    request.ctx = response.ctx = context;
    request.response = response;
    response.request = request;
    return context;
  };

  /**
   * Default error handler.
   *
   * @param {Error} err
   * @api private
   */

  onerror = err => {
    invariant(err instanceof Error, `non-error thrown: ${err}`);

    if (404 === err.status) return;

    const msg = err.stack || err.toString();

    // do not console error when using jest for test
    console.warn(`[domain: ${this.domain}]`, msg.replace(/^/gm, '  '));

    // 触发客户端的 error 事件
    this.client.emit('error', err);
  };
}

// 判断对象实例
export const isEtteApplication = createInstanceofPredicate(
  'Application',
  Application
);
