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

## document

```bash
npm run doc
```

then open the generated `out/index.html` file in your browser.

## License

[MIT](LICENSE).
