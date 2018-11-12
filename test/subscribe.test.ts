import Application from '../src/index';
import { SubscribeManager, ClientSender, MESSAGE_TYPE } from '../src/subscribe';

describe('[Subscribe] 功能 - 订阅功能', () => {
  let app, client;

  beforeEach(() => {
    app = new Application();
    client = app.client;
  });
  test('调用 subscribe 方法后，将返回 sender 实例', () => {
    expect(client.manager).toBeInstanceOf(SubscribeManager);
    const sender = (client as any).subscribe('/click/tree', {});
    expect(sender).toBeInstanceOf(ClientSender);
  });

  test('单个订阅实例，客户端向服务端发消息，服务器可以针对 url 进行匹配', done => {
    const routePath = '/click/tree';
    const sender = (client as any).subscribe(routePath, {});
    expect(sender).toBeInstanceOf(ClientSender);

    let count = 0;
    app.subscribe(routePath, {
      onMessage: (ctx: any, next) => {
        // console.log(ctx.request.toJSON());
        const req = ctx.request;
        expect(req.method).toBe('SUBSCRIBE');
        expect(req.type).toBe('JSON');
        expect(req.url).toBe(`//${app.domain}${routePath}`);
        count++;
        ctx.response.status = 200;
        ctx.response.body = { hello: 'world' };
        // return next();
      }
    });

    expect(app.hasSubscribe(routePath)).toBeTruthy();
    expect(client.hasSubscribe(routePath)).toBeTruthy();

    sender.send('hello world').then(res => {
      expect(res).toEqual({
        status: 200,
        statusText: 'OK',
        type: 'JSON',
        body: { hello: 'world' }
      });
    });

    setTimeout(() => {
      expect(count).toBe(1);
      done();
    }, 0);
  });

  test('单个订阅实例，服务器可以针对 url 进行匹配', done => {
    const routePath = '/click/tree';
    const sender = (client as any).subscribe(routePath, {});
    expect(sender).toBeInstanceOf(ClientSender);

    let count = 0;
    app.subscribe(routePath, {
      onMessage: (ctx: any, next) => {
        // console.log(ctx.request.toJSON());
        const req = ctx.request;
        expect(req.method).toBe('SUBSCRIBE');
        expect(req.type).toBe('JSON');
        expect(req.url).toBe(`//${app.domain}${routePath}`);
        count++;
        ctx.response.status = 200;
        ctx.response.body = { hello: 'world' };
        // return next();
      }
    });

    expect(app.hasSubscribe(routePath)).toBeTruthy();
    expect(client.hasSubscribe(routePath)).toBeTruthy();

    sender.send('hello world').then(res => {
      expect(res).toEqual({
        status: 200,
        statusText: 'OK',
        type: 'JSON',
        body: { hello: 'world' }
      });
    });

    setTimeout(() => {
      expect(count).toBe(1);
      done();
    }, 0);
  });

  test('单个订阅实例，服务器端向客户端推送消息', done => {
    const fakeData = 'hello world';
    let count = 0;
    (client as any).subscribe('/click/tree', {
      onMessage: function(data) {
        expect(data).toBe(fakeData);
        count++;
      }
    });

    app.send('/click/tree', fakeData);
    app.send('/click/tree', fakeData);
    setTimeout(() => {
      expect(count).toBe(2);
      done();
    }, 0);
  });

  test('多个订阅实例，同一个路径返回相同的 sender', done => {
    const sender1 = (client as any).subscribe('/click/treeA', {});
    const sender2 = (client as any).subscribe('/click/treeA', {});
    const sender3 = (client as any).subscribe('/click/treeB', {});
    expect(sender1).toBeInstanceOf(ClientSender);
    expect(sender2).toBeInstanceOf(ClientSender);
    expect(sender3).toBeInstanceOf(ClientSender);
    expect(sender1).toBe(sender2);
    expect(sender1).not.toBe(sender3);

    let count = 0;
    app.use((ctx: any, next) => {
      count++;
      const req = ctx.request;
      expect(req.method).toBe('SUBSCRIBE');
      expect(req.type).toBe('JSON');

      const path = req.url.split('/').slice(-1)[0];

      ctx.response.status = 200;
      ctx.response.body = { count: count, path: path };
    });

    sender1.send('hello world').then(res => {
      expect(res).toEqual({
        status: 200,
        statusText: 'OK',
        type: 'JSON',
        body: { count: 1, path: 'treeA' }
      });
    });

    sender2.send('hello world').then(res => {
      expect(res).toEqual({
        status: 200,
        statusText: 'OK',
        type: 'JSON',
        body: { count: 2, path: 'treeA' }
      });
    });

    sender3.send('hello world').then(res => {
      expect(res).toEqual({
        status: 200,
        statusText: 'OK',
        type: 'JSON',
        body: { count: 3, path: 'treeB' }
      });
    });

    setTimeout(() => {
      expect(count).toBe(3);
      done();
    }, 0);
  });

  test('多个订阅实例，服务器端向客户端推送消息都将接收到', done => {
    const fakeDataA = 'hello A';
    const fakeDataB = 'hello B';
    let count = 0;
    (client as any).subscribe('/click/treeA', {
      onMessage: function(data) {
        expect(data).toBe(fakeDataA);
        count++;
      }
    });
    (client as any).subscribe('/click/treeA', {
      onMessage: function(data) {
        expect(data).toBe(fakeDataA);
        count++;
      }
    });

    (client as any).subscribe('/click/treeB', {
      onMessage: function(data) {
        expect(data).toBe(fakeDataB);
        app.send('/click/treeA', fakeDataA);
        count++;
      }
    });

    app.send('/click/treeB', fakeDataB);
    setTimeout(() => {
      expect(count).toBe(3);
      done();
    }, 0);
  });
});

describe('[Subscribe] 功能 - 中间件', () => {
  let app, client;

  beforeEach(() => {
    app = new Application();
    client = app.client;
  });

  test('单个订阅实例，使用 use 安插中间件', done => {
    const routePath = '/click/tree';
    const sender = (client as any).subscribe(routePath, {});
    expect(sender).toBeInstanceOf(ClientSender);

    let count = 0;
    app.use((ctx: any, next) => {
      // console.log(ctx.request.toJSON());
      const req = ctx.request;
      expect(req.method).toBe('SUBSCRIBE');
      expect(req.type).toBe('JSON');
      expect(req.url).toBe(`//${app.domain}${routePath}`);
      count++;
      ctx.response.status = 200;
      ctx.response.body = { hello: 'world' };
      // return next();
    });

    expect(app.hasSubscribe(routePath)).toBeFalsy();
    expect(client.hasSubscribe(routePath)).toBeTruthy();

    sender.send('hello world').then(res => {
      expect(res).toEqual({
        status: 200,
        statusText: 'OK',
        type: 'JSON',
        body: { hello: 'world' }
      });
    });

    setTimeout(() => {
      expect(count).toBe(1);
      done();
    }, 0);
  });

  test('单个订阅实例，onMessage 相当于最后一个中间件', done => {
    const routePath = '/click/tree';
    const sender = (client as any).subscribe(routePath, {});
    expect(sender).toBeInstanceOf(ClientSender);

    let count = 0;
    app.use((ctx: any, next) => {
      // console.log(ctx.request.toJSON());
      const req = ctx.request;
      expect(req.method).toBe('SUBSCRIBE');
      expect(req.type).toBe('JSON');
      expect(req.url).toBe(`//${app.domain}${routePath}`);
      count++;
      ctx.response.status = 200;
      ctx.response.body = { hello: 'foo' };
      return next();
    });

    app.subscribe(routePath, {
      onMessage: (ctx: any, next) => {
        // console.log(ctx.request.toJSON());
        const req = ctx.request;
        expect(req.method).toBe('SUBSCRIBE');
        expect(req.type).toBe('JSON');
        expect(req.url).toBe(`//${app.domain}${routePath}`);
        count++;
        ctx.response.status = 200;
        ctx.response.body = { hello: 'bar' };
        // return next();
      }
    });

    expect(app.hasSubscribe(routePath)).toBeTruthy();
    expect(client.hasSubscribe(routePath)).toBeTruthy();

    sender.send('hello world').then(res => {
      expect(res).toEqual({
        status: 200,
        statusText: 'OK',
        type: 'JSON',
        body: { hello: 'bar' }
      });
    });

    setTimeout(() => {
      expect(count).toBe(2);
      done();
    }, 0);
  });

  test('单个订阅实例，服务器端向客户端推送消息，不会触发 app 端的 onMessage', done => {
    const fakeData = 'hello world';
    const routePath = '/click/tree';
    let count = 0;
    (client as any).subscribe(routePath, {
      onMessage: function(data) {
        expect(data).toBe(fakeData);
        count++;
      }
    });

    app.use(() => {
      count++; // 不会执行
    });
    app.subscribe(routePath, {
      onMessage: () => {
        count++; // 不会执行
      }
    });

    app.send('/click/tree', fakeData);
    app.send('/click/tree', fakeData);

    setTimeout(() => {
      expect(count).toBe(2);
      done();
    }, 0);
  });

  test('多个订阅实例，服务器端向客户端推送消息都将接收到', done => {
    const fakeDataA = 'hello A';
    const fakeDataB = 'hello B';
    let count = 0;
    (client as any).subscribe('/click/treeA', {
      onMessage: function(data) {
        expect(data).toBe(fakeDataA);
        count++;
      }
    });
    (client as any).subscribe('/click/treeA', {
      onMessage: function(data) {
        expect(data).toBe(fakeDataA);
        count++;
      }
    });

    (client as any).subscribe('/click/treeB', {
      onMessage: function(data) {
        expect(data).toBe(fakeDataB);
        app.send('/click/treeA', fakeDataA);
        count++;
      }
    });

    app.use(() => {
      count++; // 不会执行
    });
    app.subscribe('/click/treeB', {
      onMessage: () => {
        count++; // 不会执行
      }
    });

    app.send('/click/treeB', fakeDataB);
    setTimeout(() => {
      expect(count).toBe(3);
      done();
    }, 0);
  });
});

describe('[Subscribe] 订阅 - 重复订阅', () => {
  let app, client;

  beforeEach(() => {
    app = new Application();
    client = app.client;
  });
  test('client 端重复订阅，都能接收到消息', done => {
    const fakeData = 'hello world';
    let count = 0;
    (client as any).subscribe('/click/tree', {
      onMessage: function(data) {
        expect(data).toBe(fakeData);
        count++;
      }
    });
    (client as any).subscribe('/click/tree', {
      onMessage: function(data) {
        expect(data).toBe(fakeData);
        count++;
      }
    });

    app.send('/click/tree', fakeData);
    setTimeout(() => {
      expect(count).toBe(2);
      done();
    }, 0);
  });
  test('app 端重复订阅，最后一个订阅生效', done => {
    const fakeData = 'hello world';
    let count = 0;
    const sender1 = (client as any).subscribe('/click/tree', {
      onMessage: function(data) {
        expect(data).toBe(fakeData);
      }
    });
    const sender2 = (client as any).subscribe('/click/tree', {
      onMessage: function(data) {
        expect(data).toBe(fakeData);
      }
    });

    app.subscribe('/click/tree', {
      onMessage: () => {
        count++; 
      }
    });
    app.subscribe('/click/tree', {
      onMessage: () => {
        count += 2; 
      }
    });



    sender1.send(fakeData);
    sender2.send(fakeData);
    setTimeout(() => {
      expect(count).toBe(4);
      done();
    }, 0);
  });
});

describe('[Subscribe] unsubscribe - client 解除订阅', () => {
  let app, client;

  beforeEach(() => {
    app = new Application();
    client = app.client;
  });

  test('单个订阅实例，解除订阅', done => {
    const routePath = '/click/tree';
    const sender = (client as any).subscribe(routePath, {});
    expect(sender).toBeInstanceOf(ClientSender);

    let count = 0;
    app.subscribe(routePath, {
      onMessage: () => {
        count++;
      }
    });

    expect(app.hasSubscribe(routePath)).toBeTruthy();
    expect(client.hasSubscribe(routePath)).toBeTruthy();
    sender.send('hello world');

    expect((client as any).unsubscribe(routePath)).toBeTruthy();
    expect(app.hasSubscribe(routePath)).toBeTruthy();
    expect(client.hasSubscribe(routePath)).toBeFalsy();

    expect(() => {
      sender.send('hello world');
    }).toThrowError('sender is disconnected');
    setTimeout(() => {
      expect(count).toBe(1);
      done();
    }, 0);
  });

  test('可多次调用 unsubscribe 方法', () => {
    const routePath = '/click/tree';
    const sender = (client as any).subscribe(routePath, {});
    expect(sender).toBeInstanceOf(ClientSender);
    sender.send('hello world');

    expect((client as any).unsubscribe(routePath)).toBeTruthy();
    expect((client as any).unsubscribe(routePath)).toBeFalsy();
  });

  test('解除订阅后如果再调用将报错', () => {
    const routePath = '/click/tree';
    const sender = (client as any).subscribe(routePath, {});
    expect(sender).toBeInstanceOf(ClientSender);
    sender.send('hello world');

    expect((client as any).unsubscribe(routePath)).toBeTruthy();

    expect(() => {
      sender.send('hello world');
    }).toThrowError('sender is disconnected');
  });
});

describe('[Subscribe] unsubscribe - app 解除订阅', () => {
  let app, client;

  beforeEach(() => {
    app = new Application();
    client = app.client;
  });

  test('单个订阅实例，解除订阅', done => {
    const routePath = '/click/tree';
    const sender = (client as any).subscribe(routePath, {});
    expect(sender).toBeInstanceOf(ClientSender);

    let count = 0;
    app.subscribe(routePath, {
      onMessage: () => {
        count++;
      }
    });

    sender.send('hello world');
    sender.send('hello world');

    app.unsubscribe(routePath);

    sender.send('hello world');

    setTimeout(() => {
      expect(count).toBe(2);
      done();
    }, 0);
  });

  test('可以重复解除订阅', done => {
    const routePath = '/click/tree';
    const sender = (client as any).subscribe(routePath, {});
    expect(sender).toBeInstanceOf(ClientSender);

    let count = 0;
    app.subscribe(routePath, {
      onMessage: () => {
        count++;
      }
    });

    sender.send('hello world');
    sender.send('hello world');

    expect(app.unsubscribe(routePath)).toBeTruthy();
    expect(app.unsubscribe(routePath)).toBeFalsy();

    sender.send('hello world');

    setTimeout(() => {
      expect(count).toBe(2);
      done();
    }, 0);
  });
});
