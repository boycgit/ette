import * as HttpStatus from 'http-status-codes';
import {
  only,
  invariant,
  isExist,
  getByteLen,
  getBodyType,
  CONTENT_TYPE
} from './lib';

interface ResponseConfig {
  statusCode?: number;
  type?: CONTENT_TYPE;
  body?: any;
}

export default class Response {
  code: number;
  _body: any;
  length: number;
  type: CONTENT_TYPE;
  constructor(config?: ResponseConfig) {
    const {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR,
      body = {}
    } = config || {};
    this.code = statusCode; // 状态码
    this._body = body;
      this.type = getBodyType(body);
  }

  get status() {
    return this.code;
  }

  get statusText() {
    return HttpStatus.getStatusText(this.code);
  }

  get body() {
    return this._body;
  }
  set body(val) {
    this._body = val;
    this.length = getByteLen(val);
    this.type = getBodyType(val);
    if (!isExist(val)) {
      this.status = HttpStatus.NO_CONTENT;
    }
  }

  set status(code: number) {
    invariant(code in HttpStatus, `invalid status code: ${code}`);
  }

  toJSON() {
    return only(this, ['status', 'statusText', 'type', 'body']);
  }
}
