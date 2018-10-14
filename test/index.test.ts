import Application from '../src/index';
import Response from '../src/response';
import Client from '../src/client';
import * as Chance from 'chance';
const chance = new Chance();

describe('[Application] 构造函数 - 构造函数', () => {
  test('创建默认的 App 实例，会生成随机 domain（长度是 8 ）', () => {
    const app = new Application();
    expect(app.domain.length).toBe(8);
    expect(app.middleware.length).toBe(0);
    expect(app.context).toEqual({});
    expect(app.response).toBeInstanceOf(Response);
    expect(app.client).toBeInstanceOf(Client);
  });
  test('创建默认的 App 实例，会生成随机 domain（长度是 8 ）', () => {
    const app = new Application({});
    expect(app.domain.length).toBe(8);
    expect(app.middleware.length).toBe(0);
    expect(app.context).toEqual({});
    expect(app.response).toBeInstanceOf(Response);
    expect(app.client).toBeInstanceOf(Client);
  });

  test('创建默认的 App 实例，会生成随机 domain（长度是 8 ）', () => {
    const app = new Application({ domain: 'jscon' });
    expect(app.domain).toBe('jscon');
    expect(app.middleware.length).toBe(0);
    expect(app.context).toEqual({});
    expect(app.response).toBeInstanceOf(Response);
    expect(app.client).toBeInstanceOf(Client);
  });
});

describe('[Application] 事件 - 事件监听', () => {
  test('创建的实例，默认已监听 request、error 等事件', () => {
    const app = new Application();
    expect(app.getListeners('request').length).toBe(1);
    expect(app.getListeners('error').length).toBe(1);
  });
});

describe('[Application] 事件 - error 事件', () => {
  test('app 触发 error 事件，如果入参不是 err 对象将会报错', () => {
    const app = new Application();
    expect(() => {
      app.emit('error', { stack: 'inner error' });
    }).toThrowError(/non-error/);

    app.emit('error', new Error('inner error'));
  });
  test('app 支持绑定自定义 error 监听事件，需要手动 listen', done => {
      const app = new Application({ autoListen: false});
    let occur = 0;
    app.on('error', err => {
      expect(err).toBeInstanceOf(Error);
      expect(err.toString()).toContain('inner error');
      occur++;
    });
    app.listen();

    app.emit('error', new Error('inner error'));
    setTimeout(() => {
      expect(occur).toBe(1);
      done();
    }, 0);
  });

  test('如果是 404 错误，app.client 不会接收到 error 事件', done => {
    const app = new Application();

    let occur = 0;
    app.client.on('error', err => {
      occur++;
    });
    let err = new Error('inner error');
    (err as any).status = 404;
    app.emit('error', err);

    setTimeout(() => {
      expect(occur).toBe(0);
      done(); // end test case
    }, 0);
  });

  test('非 404 错误，app.client 也会接收到 error 事件', done => {
    const app = new Application();
    let occur = 0;
    app.client.on('error', err => {
      expect(err).toBeInstanceOf(Error);
      expect(err.toString()).toMatch('inner error');
      occur++;
    });

    const err = new Error('inner error');
    err.stack = null; // 让 stack 失效
    app.emit('error',err);
    setTimeout(() => {
      expect(occur).toBe(1);
      done(); // end test case
    }, 0);
  });
});

describe('[Application] 中间件 - use 中间件', () => {
  let app, client;

  beforeEach(() => {
    app = new Application();
    client = app.client;
  });
  test('不使用中间件，则返回 404 状态', () => {
    (client as any)
      .get('/users/jscon', 'TEXT')
      .then(res => {
        expect(res).toEqual({
          status: 404,
          statusText: 'Not Found',
          type: 'JSON',
          body: {}
        });
      })
      .catch(err => {
        console.log(err);
      });
  });
  test('使用单个中间件', () => {
    app.use(async (ctx: any, next) => {
      // console.log(ctx.request.toJSON());

      const req = ctx.request;
      expect(req.method).toBe('GET');
      expect(req.type).toBe('JSON');
      expect(req.url).toBe(`//${app.domain}/users/jscon`);

      ctx.response.status = 200;
      ctx.response.body = { hello: 'world' };
      await next();
    });

    (client as any)
      .get('/users/jscon')
      .then(res => {
        expect(res).toEqual({
          status: 200,
          statusText: 'OK',
          type: 'JSON',
          body: { hello: 'world' }
        });
      })
      .catch(err => {
        console.log(err);
      });
  });

  test('使用 2 个中间件的情况', () => {
    app.use(async (ctx: any, next) => {
      // console.log(ctx.request.toJSON());

      const req = ctx.request;
      expect(req.method).toBe('GET');
      expect(req.type).toBe('JSON');
      expect(req.url).toBe(`//${app.domain}/users/jscon`);

      ctx.response.status = 200;
      ctx.response.body = { hello: 'world' };
      await next();
    });

    app.use(async (ctx: any, next) => {
      // console.log(ctx.request.toJSON());

      const req = ctx.request;
      expect(req.method).toBe('GET');
      expect(req.type).toBe('JSON');
      expect(req.url).toBe(`//${app.domain}/users/jscon`);

      ctx.response.status = 500;
      ctx.response.body = { msg: 'inner error' };
      await next();
    });

    (client as any)
      .get('/users/jscon')
      .then(res => {
        expect(res).toEqual({
          status: 500,
          statusText: 'Server Error',
          type: 'JSON',
          body: { msg: 'inner error' }
        });
      })
      .catch(err => {
        console.log(err);
      });
  });
});

describe('[Application] 中间件 - 路由功能（并发隔离）', () => {
  let app, client;

  beforeEach(() => {
    app = new Application();
    client = app.client;
  });
  test('单个中间件情况', () => {
    app.use(async (ctx: any, next) => {
      const req = ctx.request;
      expect(req.method).toBe('GET');
      expect(req.type).toBe('JSON');

      //   相当简单的路由
      if (req.path === '/users/1') {
        expect(req.url).toBe(`//${app.domain}/users/1`);
        ctx.response.body = { hello: 'jscon' };
      } else if (req.path === '/users/2') {
        expect(req.url).toBe(`//${app.domain}/users/2`);
        ctx.response.body = { hello: 'nancy' };
      } else {
        ctx.response.body = { hello: 'anonymity' };
      }

      ctx.response.status = 200;

      await next();
    });

    (client as any)
      .get('/users/1')
      .then(res => {
        expect(res).toEqual({
          status: 200,
          statusText: 'OK',
          type: 'JSON',
          body: { hello: 'jscon' }
        });
      })
      .catch(err => {
        console.log(err);
      });

    (client as any)
      .get('/users/2')
      .then(res => {
        expect(res).toEqual({
          status: 200,
          statusText: 'OK',
          type: 'JSON',
          body: { hello: 'nancy' }
        });
      })
      .catch(err => {
        console.log(err);
      });

    (client as any)
      .get(`/users/${chance.integer({ min: 3, max: 10 })}`)
      .then(res => {
        expect(res).toEqual({
          status: 200,
          statusText: 'OK',
          type: 'JSON',
          body: { hello: 'anonymity' }
        });
      })
      .catch(err => {
        console.log(err);
      });
  });

  test('使用 2 个中间件的情况', () => {
    app.use(async (ctx: any, next) => {
      const req = ctx.request;
      expect(req.method).toBe('GET');
      expect(req.type).toBe('JSON');

      //   相当简单的路由
      if (req.path === '/users/1') {
        expect(req.url).toBe(`//${app.domain}/users/1`);
        ctx.response.body = { hello: 'jscon' };
      } else if (req.path === '/users/2') {
        expect(req.url).toBe(`//${app.domain}/users/2`);
        ctx.response.body = { hello: 'nancy' };
      } else {
        ctx.response.body = { hello: 'anonymity' };
      }
      ctx.response.status = 200;
      await next();
    });

    app.use(async (ctx: any, next) => {
      // console.log(ctx.request.toJSON());

      const req = ctx.request;
      expect(req.method).toBe('GET');
      expect(req.type).toBe('JSON');

      ctx.response.status = 500;
      //   相当简单的路由
      if (req.path === '/users/1') {
        expect(req.url).toBe(`//${app.domain}/users/1`);
        ctx.response.body = { hello: 'jscon' };
        ctx.response.status = 200;
      } else if (req.path === '/users/2') {
        expect(req.url).toBe(`//${app.domain}/users/2`);
        ctx.response.body = { hello: 'nancy' };
        ctx.response.status = 200;
      } else {
        ctx.response.body = { msg: 'anonymity' };
      }
      await next();
    });

    (client as any)
      .get('/users/1')
      .then(res => {
        expect(res).toEqual({
          status: 200,
          statusText: 'OK',
          type: 'JSON',
          body: { hello: 'jscon' }
        });
      })
      .catch(err => {
        console.log(err);
      });

    (client as any)
      .get('/users/2')
      .then(res => {
        expect(res).toEqual({
          status: 200,
          statusText: 'OK',
          type: 'JSON',
          body: { hello: 'nancy' }
        });
      })
      .catch(err => {
        console.log(err);
      });

    (client as any)
      .get(`/users/${chance.integer({ min: 3, max: 10 })}`)
      .then(res => {
        expect(res).toEqual({
          status: 500,
          statusText: 'Server Error',
          type: 'JSON',
          body: { msg: 'anonymity' }
        });
      })
      .catch(err => {
        console.log(err);
      });
  });
});
