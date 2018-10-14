// import * as HttpStatus from 'http-status-codes';
import { only, invariant, getByteLen, getBodyType, CONTENT_TYPE } from './lib';

const HttpStatus = require('http-status-codes');

const getStatusText = HttpStatus.getStatusText;

interface ResponseConfig {
  status?: number;
  body?: any;
}

export default class Response {
  code: number;
  _body: any;
  length: number;
  type: CONTENT_TYPE;
  constructor(config?: ResponseConfig) {
    const { status = HttpStatus.NOT_FOUND, body = {} } = config || {};
    this.code = status; // 状态码
    this._body = body;
    this.type = getBodyType(body);
    this.length = getByteLen(body);
  }

  get status() {
    return this.code;
  }

  get statusText() {
    return getStatusText(this.code);
  }

  get body() {
    return this._body;
  }
  set body(val) {
    this._body = val;
    this.length = getByteLen(val);
    this.type = getBodyType(val);
    if (!val) {
      this.status = HttpStatus.NO_CONTENT;
    }
  }

  set status(code: number) {
    invariant(getStatusText(code), `invalid status code: ${code}`);
    this.code = code;
  }

  toJSON() {
    return only(this, ['status', 'statusText', 'type', 'body']);
  }
}
