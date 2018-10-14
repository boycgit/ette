# ette
[![Build Status](https://travis-ci.org/boycgit/ette.svg?branch=master)](https://travis-ci.org/boycgit/ette) [![Coverage Status](https://coveralls.io/repos/github/boycgit/ette/badge.svg?branch=master)](https://coveralls.io/github/boycgit/ette?branch=master) [![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php) [![npm version](https://badge.fury.io/js/ette.svg)](https://badge.fury.io/js/ette)

Event-Driver message communication framework, koa style, to make browser web applications and APIs more enjoyable to write and maintain.

 - written in Typescript
 - used with koa style
 - fully tested


## Installation

### Node.js / Browserify

```bash
npm install ette --save
```

```javascript
var Ette = require('ette');
```

### Global object

Include the pre-built script.

```html
<script src="./dist/index.umd.min.js"></script>

```

## Build & test

```bash
npm run build
```

```bash
npm test
```

## Usage
> https://repl.it/@boycgit/ette-usage-1


```js
var App = require('ette');
const app = new App({domain: 'any-domain-name'});
const client = app.client;

app.use((ctx, next) => {
  const req = ctx.request;
  console.log('request:'+ JSON.stringify(req.toJSON()));

  //   相当简单的路由
  if (req.path === '/users/1') {
    ctx.response.body = { hello: 'jscon' };
  } else if (req.path === '/users/2') {
    ctx.response.body = { hello: 'nancy' };
  } else {
    ctx.response.body = { hello: 'anonymity' };
  }
  
  ctx.response.status = 200;

  return next();
});

client.post(`/users/4`)
  .then(res => {
    console.log('/users/4:' + JSON.stringify(res));
  })
  .catch(err => {
    console.log(err);
  });
```

console output will be:

```sh
request:{"method":"POST","url":"//any-domain-name/users/4","type":"JSON"}

/users/4:{"status":200,"statusText":"OK","type":"JSON","body":{"hello":"anonymity"}}
```

## Document

```bash
npm run doc
```

then open the generated `out/index.html` file in your browser.

## License

[MIT](LICENSE).
