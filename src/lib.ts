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

export function uuid(len?: number, radix?: number) {
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
 * Check if `body` should be interpreted as json in ette
 */

export function getBodyType(body): CONTENT_TYPE {
  if (!body) return CONTENT_TYPE.TEXT;
  if ('string' == typeof body) return CONTENT_TYPE.TEXT;
  return CONTENT_TYPE.JSON;
}

export function getByteLen(body: string | Buffer): number {
  const type = getBodyType(body);

  let length: number = 0;

  switch (type) {
    case CONTENT_TYPE.JSON:
      length = JSON.stringify(body).length;
      break;

    case CONTENT_TYPE.TEXT:
      length = body.length;
    default:
      length = 0;
      break;
  }
  return length;
}

//  see https://30secondsofcode.org/string#capitalize
export const capitalize = ([first, ...rest], lowerRest = false) =>
  first.toUpperCase() +
  (lowerRest ? rest.join('').toLowerCase() : rest.join(''));


export function isObject(value) {
  return value !== null && typeof value === "object";
}
export function createInstanceofPredicate(name, clazz) {
  var propName = "isEtte" + name;
  clazz.prototype[propName] = true;
  return function (x) {
    return isObject(x) && x[propName] === true;
  };
}

