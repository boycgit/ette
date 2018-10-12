// test https://runkit.com/boycgit/ette

import Url = require('url-parse');
import { only, CONTENT_TYPE, HTTP_METHOD } from './lib';
const stringify = Url.qs.stringify;
const parser = Url.qs.parse;


interface RequestConfig {
    url?:string;
    method?:HTTP_METHOD;
    type?:CONTENT_TYPE;
}

export default class Request {
  parsed: Url;
  method: HTTP_METHOD;
  type: CONTENT_TYPE;

constructor(config?: RequestConfig) {
    const { url='', method = HTTP_METHOD.GET, type = CONTENT_TYPE.JSON} = config || {};
    this.parsed = new Url(url, void 0, true);
    this.method = method;
    this.type = type;
  }

  get url():string {
    return this.parsed.toString();
  }
  set url(val) {
    this.parsed = new Url(val, void 0, true);
  }

  get host():string{
      return this.parsed.host;
  }
  set host(val:string){
      if(!!val){
          this.parsed.set('host', val);
      }
  }

  get hostname(){
      return this.parsed.hostname;
  }

  get origin():string {
    return `//${this.parsed.host}`;
  }

  get path():string {
    return this.parsed.pathname;
  }
  set path(val: string) {
    this.parsed.set('pathname', val);
  }

  get query():object {
    return this.parsed.query;
  }
  set query(obj: object) {
    this.parsed.set('query', obj);
  }

  get querystring():string {
    return stringify(this.query);
  }
  set querystring(val: string) {
    this.query = parser(val);
  }

  get search(): string{
      return `?${this.querystring}`
  }

    set search(val: string){
    this.querystring = val;
  }

    get idempotent(): boolean{
        const methods = [HTTP_METHOD.GET, HTTP_METHOD.PUT];
        return !!~methods.indexOf(this.method);
    }

    toJSON(){
        return only(this, [
            'method', 'url', 'type'
        ])
    }
}
