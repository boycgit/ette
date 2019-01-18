import {Client} from '../src/client';
import Application from '../src/index';
import { HTTP_METHOD } from '../src/lib';
import {Response} from '../src/response';

const METHODS_LOWERCASE: string[] = Object.keys(HTTP_METHOD).map(k =>
  HTTP_METHOD[k as any].toLowerCase()
);

describe('[Client] 构造函数 - 构造函数', () => {
  test('创建 Client 实例，必须传入 app 参数', () => {
    expect(() => {
      new Client();
    }).toThrow();
  });

  test('验证  Client 实例上的方法', () => {
    const app = new Application();
    const client = new Client(app);
    expect(client.domain).toBe(app.domain);
    expect(client.app).toBeInstanceOf(Application);
    METHODS_LOWERCASE.forEach(method => {
      expect(client).toHaveProperty(method);
    });
    expect(client).toHaveProperty('del');
  });
});

describe('[Client] 方法 - 检查 verb() 返回值', () => {
  let app, client;

  beforeEach(() => {
    app = new Application();
    client = new Client(app);
  });

  METHODS_LOWERCASE.forEach(method => {
    // subscribe 的功能单独测试
    if(method !== 'subscribe') {
      test(`支持 client.${method} 方法`, () => {
        app.removeEvent('request'); // 先移除内置的 request 事件监听器
        app.on('request', (req, lastMiddleware) => {
          // console.log(req);
          expect(req.host).toBe(app.domain);
          expect(req.url).toBe(`//${app.domain}/users/jscon`);
          expect(req.type).toBe('TEXT');
          expect(req.method).toBe(method.toUpperCase());
  
          // 模拟中间件形态
          const fakeResponse = {
            response: new Response({ status: 200 , body: 'hello world'})
          };
          new Promise(function(resolve) {
            resolve(fakeResponse);
          }).then(lastMiddleware);
        });
  
        client[method]('/users/jscon', {}, 'text').then(res => {
          expect(res.status).toBe(200);
          expect(res.type).toBe('TEXT');
          expect(res.body).toBe('hello world');
        }).catch(err => {
          console.log(err);
        });;
      });
    }
  });

  test('验证 client.get 等方法返回 404 的场景', () => {
    app.removeEvent('request'); // 先移除内置的 request 事件监听器
    app.on('request', (req, lastMiddleware) => {
      // console.log(req);
      expect(req.host).toBe(app.domain);
      expect(req.url).toBe(`//${app.domain}/users/jscon`);
      expect(req.type).toBe('TEXT');
      expect(req.method).toBe('GET');

      // 模拟中间件形态
      new Promise(function(resolve) {
        resolve();
      }).then(lastMiddleware);
    });

    client.get('/users/jscon',{},  'text').then(res => {
      expect(res.status).toBe(404);
      expect(res.type).toBe('JSON');
    }).catch(err=>{
      console.log(err);
    });
  });
});
