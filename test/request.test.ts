import Request from '../src/request';
import { HTTP_METHOD, CONTENT_TYPE } from '../src/lib';
import * as Chance from 'chance';
const chance = new Chance();

const METHODS_LOWERCASE: string[] = Object.keys(HTTP_METHOD).map(k =>
  HTTP_METHOD[k as any].toLowerCase()
);

const CONTENT_TYPE_LOWERCASE: string[] = Object.keys(CONTENT_TYPE).map(k =>
  CONTENT_TYPE[k as any].toLowerCase()
);

describe('[Request] 构造函数 - 构造函数', () => {
  let domain, port, path, querystring, url, req;
  beforeEach(() => {
    domain = chance.domain().toLowerCase();
    port = chance.integer({ min: 10, max: 10000 });
    path = (
      chance.string({ length: 8 }) +
      '/' +
      chance.string({ length: 6 })
    ).replace(/\#/g, '');
    querystring = 'foo=bar&name=jscon';
    url = `//${domain}:${port}/${path}?${querystring}`;
  });

  afterEach(() => {
    expect(req.method).toBe('GET');
    expect(req.type).toBe('JSON');
    expect(req.idempotent).toBeTruthy();
  });
  test('默认 Request 对象的 url 为空，GET 方法，请求类型为 JSON', () => {
    req = new Request();
    expect(req.url).toBe('');
  });

  test('配置项 url', () => {
    req = new Request({ url: url });
    expect(req.url).toBe(url);
    expect(req.host).toBe(`${domain}:${port}`);
    expect(req.origin).toBe(`//${domain}:${port}`);
    expect(req.path).toBe(`/${path}`);
    expect(req.query).toEqual({ foo: 'bar', name: 'jscon' });
    expect(req.querystring).toEqual(querystring);
    expect(req.search).toEqual(`?${querystring}`);
  });
});

describe('[Request] 属性 - 更改各种属性', () => {
  let domain, port, path, querystring, url, req;
  beforeEach(() => {
    domain = chance.domain();
    port = chance.integer({ min: 10, max: 10000 });
    path = (
      chance.string({ length: 8 }) +
      '/' +
      chance.string({ length: 6 })
    ).replace(/\#/g, '');
    querystring = 'foo=bar&name=jscon';
    url = `//${domain}:${port}/${path}?${querystring}`;
  });

  test(`更改 method 属性`, () => {
    METHODS_LOWERCASE.forEach(method => {
      req = new Request({ method: method as HTTP_METHOD });
      expect(req.method).toBe(method.toUpperCase());
    });

    METHODS_LOWERCASE.forEach(method => {
      req.method = method;
      expect(req.method).toBe(method.toUpperCase());
    });

    const randomName = chance.string({ length: 8 }).toUpperCase();
    expect(() => {
      req = new Request({ method: randomName as HTTP_METHOD });
    }).toThrow();

    expect(() => {
      req.method = randomName;
    }).toThrow();
  });

  test(`更改 type 属性`, () => {
    CONTENT_TYPE_LOWERCASE.forEach(type => {
      req = new Request({ type: type as CONTENT_TYPE });
      expect(req.type).toBe(type.toUpperCase());
    });
    CONTENT_TYPE_LOWERCASE.forEach(type => {
      req.type = type;
      expect(req.type).toBe(type.toUpperCase());
    });

    const randomName = chance.string({ length: 8 }).toUpperCase();
    expect(() => {
      req = new Request({ type: randomName as CONTENT_TYPE });
    }).toThrow();

    expect(() => {
      req.type = randomName;
    }).toThrow();
  });

  test('更改 url 属性', () => {
    req = new Request();
    req.url = url;
    expect(req.url).toBe(url);
    expect(req.host).toBe(`${domain}:${port}`);
    expect(req.origin).toBe(`//${domain}:${port}`);
    expect(req.path).toBe(`/${path}`);
    expect(req.query).toEqual({ foo: 'bar', name: 'jscon' });
    expect(req.querystring).toEqual(querystring);
    expect(req.search).toEqual(`?${querystring}`);
  });

  test('更改 host 属性', () => {
    req = new Request({ url: url });
    req.host = '';
    expect(req.host).toBe('');

    const newHost = chance.string({ length: 11 }).toLowerCase();
    req.host = newHost;
    expect(req.host).toBe(newHost);
    expect(req.origin).toBe(`//${newHost}`);
    expect(req.path).toBe(`/${path}`);
    expect(req.query).toEqual({ foo: 'bar', name: 'jscon' });
    expect(req.querystring).toEqual(querystring);
    expect(req.search).toEqual(`?${querystring}`);
  });

  test('更改 path 属性', () => {
    req = new Request({ url: url });
    const newPath = chance.string({ length: 11 });
    req.path = newPath;
    expect(req.host).toBe(`${domain}:${port}`);
    expect(req.origin).toBe(`//${domain}:${port}`);
    expect(req.path).toBe(`/${newPath}`);
    expect(req.query).toEqual({ foo: 'bar', name: 'jscon' });
    expect(req.querystring).toEqual(querystring);
    expect(req.search).toEqual(`?${querystring}`);
  });

  test('更改 query 属性', () => {
    req = new Request({ url: url });
    const newQuery = { id: 123 };
    req.query = newQuery;
    expect(req.host).toBe(`${domain}:${port}`);
    expect(req.origin).toBe(`//${domain}:${port}`);
    expect(req.path).toBe(`/${path}`);
    expect(req.query).toEqual({ id: 123 });
    expect(req.querystring).toEqual('id=123');
    expect(req.search).toEqual(`?id=123`);
  });

  test('更改 querystring 属性', () => {
    req = new Request({ url: url });
    const newQs = 'id=123';
    req.querystring = newQs;
    expect(req.host).toBe(`${domain}:${port}`);
    expect(req.origin).toBe(`//${domain}:${port}`);
    expect(req.path).toBe(`/${path}`);
    expect(req.query).toEqual({ id: '123' });
    expect(req.querystring).toEqual('id=123');
    expect(req.search).toEqual(`?id=123`);
  });

  test('更改 search 属性', () => {
    req = new Request({ url: url });
    const newSearch = 'id=123';
    req.search = newSearch;
    expect(req.host).toBe(`${domain}:${port}`);
    expect(req.origin).toBe(`//${domain}:${port}`);
    expect(req.path).toBe(`/${path}`);
    expect(req.query).toEqual({ id: '123' });
    expect(req.querystring).toEqual('id=123');
    expect(req.search).toEqual(`?id=123`);
  });
});

describe('[Request] 方法 - toJSON', () => {
  test('返回 url, method, type 三个字段', () => {
    const url = chance.url().replace(/^http(s)?\:/, '');
    const req = new Request({ url });
    expect(req.toJSON()).toEqual({
      url: url,
      method: 'GET',
      type: 'JSON'
    });
  });
});
