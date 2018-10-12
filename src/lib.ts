export enum CONTENT_TYPE {
  JSON = 'JSON',
  TEXT = 'TEXT',
  BINARY = 'BINARY'
}

export enum HTTP_METHOD {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  SUBSCRIBE = 'SUBSCRIBE'
}

export function requiredParam(param: string): never {
  const requiredParamError = new Error(
    `Required parameter, "${param}" is missing.`
  );
  // preserve original stack trace
  if (typeof Error.captureStackTrace === 'function') {
    Error.captureStackTrace(requiredParamError, requiredParam);
  }
  throw requiredParamError;
}

export function uuid(len: number, radix?: number) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(
    ''
  );
  var uuid: Array<string> = [],
    i: number;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
  } else {
    // rfc4122, version 4 form
    var r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join('');
}

export function only(obj: object, keys: string | string[]): object {
  obj = obj || {};
  if ('string' == typeof keys) keys = keys.split(/ +/);
  return keys.reduce(function(ret, key) {
    if (null == obj[key]) return ret;
    ret[key] = obj[key];
    return ret;
  }, {});
}

export function invariant(check, message, scope = 'ette') {
  if (!check) {
    throw new Error(
      `${scope ? '[' + scope + ']' : ''} Invariant failed: ${message}`
    );
  }
}

/**
 * 判断对象是否存在
 * @param {*} val - 待判断的对象
 * @param {bool} andString - 也要考虑字符串的 'undefined' 和 'null' 情况
 */
export function isExist(val: any, andString = true): boolean {
  const result = typeof val !== 'undefined' && val !== null;

  if (andString) {
    return result && val !== 'undefined' && val !== 'null';
  } else {
    return result;
  }
}

export function isJSON(item): boolean {
  item = typeof item !== 'string' ? JSON.stringify(item) : item;

  try {
    item = JSON.parse(item);
  } catch (e) {
    return false;
  }

  if (typeof item === 'object' && item !== null) {
    return true;
  }

  return false;
}

/**
 * Check if `body` should be interpreted as json in ette
 */

export function getBodyType(body): CONTENT_TYPE {
  if (!isExist(body, false)) return CONTENT_TYPE.TEXT;
  if ('string' == typeof body) return CONTENT_TYPE.TEXT;
  if (Buffer.isBuffer(body)) return CONTENT_TYPE.BINARY;
  return CONTENT_TYPE.JSON;
}

export function getByteLen(body: string | Buffer): number {
  const type = getBodyType(body);

  let length: number = 0;

  switch (type) {
    case CONTENT_TYPE.JSON:
      length = Buffer.byteLength(JSON.stringify(body));
      break;

    case CONTENT_TYPE.TEXT:
      length = Buffer.byteLength(body);

    case CONTENT_TYPE.BINARY:
      length = body.length;
    default:
      length = 0;
      break;
  }
  return length;
}


/**
 * Safe decodeURIComponent, won't throw any error.
 * If `decodeURIComponent` error happen, just return the original value.
 *
 * @param {String} text
 * @returns {String} URL decode original string.
 * @private
 */

export function safeDecodeURIComponent(text: string) {
  try {
    return decodeURIComponent(text);
  } catch (e) {
    return text;
  }
}
