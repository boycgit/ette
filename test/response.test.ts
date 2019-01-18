import {Response} from '../src/response';
import * as HttpStatus from 'http-status-codes';
import * as Chance from 'chance';
const chance = new Chance();
const getStatusText = HttpStatus.getStatusText;

describe('[Response] 构造函数 - 构造函数', () => {
  let res;
  test('默认 Response 对象的返回 404 状态码', () => {
    res = new Response();
    expect(res.status).toBe(404);
    expect(res.statusText).toBe(getStatusText(404));
    expect(res.body).toEqual({});
    expect(res.type).toBe('JSON');
    expect(res.length).toBe(2);
  });

  test('传入 status, body 参数', () => {
    const body = { name: 'jscon' };
    const res = new Response({ status: 200, body: body });
    expect(res.status).toBe(200);
    expect(res.statusText).toBe(getStatusText(200));
    expect(res.body).toEqual(body);
    expect(res.type).toBe('JSON');
    expect(res.length).toBe(16);
  });
});

describe('[Response] 属性 - 更改属性', () => {
  let res,
    body = { name: 'jscon' };
  beforeEach(() => {
    res = new Response({ status: 200, body: body });
  });
  test('更改 status 状态码', () => {
    res.status = 404;
    expect(res.status).toBe(404);
    expect(res.statusText).toBe(getStatusText(404));
    expect(res.body).toEqual(body);
    expect(res.type).toBe('JSON');
    expect(res.length).toBe(16);
  });
  test('更改 status 状态码为非法将抛出错误', () => {
      const code = chance.integer({ min: 1000, max: 20000 });

    expect(()=>{
        res.status = code;
    }).toThrow();
  });

  test('更改 body 内容', () => {
    const newBody = { id: 12345 };
    res.body = newBody;
    expect(res.status).toBe(200);
    expect(res.statusText).toBe(getStatusText(200));
    expect(res.body).toEqual(newBody);
    expect(res.type).toBe('JSON');
    expect(res.length).toBe(12);
  });

  test('更改 body 内容为空', () => {
    res.body = '';
    expect(res.status).toBe(204);
    expect(res.statusText).toBe(getStatusText(204));
    expect(res.body).toEqual('');
    expect(res.type).toBe('TEXT');
    expect(res.length).toBe(0);
  });
});

describe('[Response] 方法 - toJSON', () => {
  test('返回 status, statusText, type，body 四个字段', () => {
    const body = {
      user: 'jscon'
    };
    const req = new Response({ status: 200, body: body });
    expect(req.toJSON()).toEqual({
      status: 200,
      statusText: getStatusText(200),
      body: body,
      type: 'JSON'
    });
  });
});
