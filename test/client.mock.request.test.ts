import Client from '../src/client';
import Request from '../src/request';
import Application from '../src/index';
import { HTTP_METHOD } from '../src/lib';

jest.mock('../src/request'); // mock request 方法

const METHODS_LOWERCASE: string[] = Object.keys(HTTP_METHOD).map(k =>
  HTTP_METHOD[k as any].toLowerCase()
);

describe('[Client] 方法 - verb()', () => {
  const app = new Application();
  let client;

  beforeEach(() => {
    client = new Client(app);
    (Request as any).mockClear();
  });

  METHODS_LOWERCASE.forEach(method => {
    test(`验证 client.${method} 方法`, () => {
      client[method]('/users/jscon', 'JSON');
      expect(Request).toHaveBeenCalledTimes(1);
      const reqestConfig = (Request as any).mock.calls[0][0];
      expect(reqestConfig.url).toBe('/users/jscon');
      expect(reqestConfig.method).toBe(method.toUpperCase());
      expect(reqestConfig.type).toBe('JSON');
    });
  });
});

