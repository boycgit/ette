// test https://runkit.com/boycgit/ette

import Url = require('url-parse');
import { only, CONTENT_TYPE, HTTP_METHOD, invariant } from './lib';
const stringify = Url.qs.stringify;
const parser = Url.qs.parse;

const regProtocol = /^http(s)?\:/g;
interface RequestConfig {
  url?: string;
  method?: HTTP_METHOD;
  type?: CONTENT_TYPE;
}

export default class Request {
  parsed: Url;
  _method: HTTP_METHOD;
  _type: CONTENT_TYPE;

  constructor(config?: RequestConfig) {
    const { url = '', method = HTTP_METHOD.GET, type = CONTENT_TYPE.JSON } =
      config || {};

      // 为了方便统一，需要将输入的 url 的 protocol 删除掉
    this.parsed = new Url(url.replace(regProtocol, ''), {}, true);
    const methodName = method.toUpperCase() as HTTP_METHOD;
    invariant(
      HTTP_METHOD[methodName],
      `request method: ${methodName} is invalid`
    );
    this._method = methodName;

    const typeName = type.toUpperCase() as CONTENT_TYPE;
    invariant(
      CONTENT_TYPE[typeName],
      `request content type: ${typeName} is invalid`
    );
    this._type = typeName;
  }

  get method() {
    return this._method;
  }

  set method(val: string) {
    const methodName = val.toUpperCase() as HTTP_METHOD;
    invariant(
      HTTP_METHOD[methodName],
      `request method: ${methodName} is invalid`
    );
    this._method = methodName;
  }

  get type() {
    return this._type;
  }

  set type(val: string) {
    const typeName = val.toUpperCase() as CONTENT_TYPE;
    invariant(
      CONTENT_TYPE[typeName],
      `request content type: ${typeName} is invalid`
    );
    this._type = typeName;
  }

  get url(): string {
    var str = this.parsed.toString();
    return !!this.host && !str.startsWith('//') ? `//${str}` : str;
  }
  set url(val) {
    this.parsed = new Url(val, {}, true);
  }

  get host(): string {
    return this.parsed.host;
  }
  set host(val: string) {
    this.parsed.set('host', val);
  }

  get origin(): string {
    return `//${this.parsed.host}`;
  }

  get path(): string {
    return this.parsed.pathname;
  }
  set path(val: string) {
    this.parsed.set('pathname', val);
  }

  get query(): object {
    return this.parsed.query;
  }
  set query(obj: object) {
    this.parsed.set('query', obj);
  }

  get querystring(): string {
    return stringify(this.query);
  }
  set querystring(val: string) {
    this.query = parser(val);
  }

  get search(): string {
    return `?${this.querystring}`;
  }

  set search(val: string) {
    this.querystring = val;
  }

  get idempotent(): boolean {
    const methods = [HTTP_METHOD.GET, HTTP_METHOD.PUT];
    return !!~methods.indexOf(this._method);
  }

  toJSON() {
    return only(this, ['method', 'url', 'type']);
  }
}
