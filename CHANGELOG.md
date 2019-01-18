# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="0.3.3"></a>
## [0.3.3](https://github.com/boycgit/ette/compare/v0.3.2...v0.3.3) (2019-01-18)


### Features

* **功能改进:** 增加导出的类型种类（诸如 Request、Response、IContext），方便第三方库引用 ([087d842](https://github.com/boycgit/ette/commit/087d842))



<a name="0.3.2"></a>
## [0.3.2](https://github.com/boycgit/ette/compare/v0.3.1...v0.3.2) (2018-11-13)


### Bug Fixes

* **bugfix:** 当创建 subscribe 方法时，可以不用显示传入 `{}` 作为第二个参数 ([2ae1ded](https://github.com/boycgit/ette/commit/2ae1ded))



<a name="0.3.1"></a>
## [0.3.1](https://github.com/boycgit/ette/compare/v0.3.0...v0.3.1) (2018-11-13)


### Bug Fixes

* **bugfix:** update rollup config, with named exports; import EventEmitter with require; ([862d024](https://github.com/boycgit/ette/commit/862d024))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/boycgit/ette/compare/v0.2.2...v0.3.0) (2018-11-13)


### Features

* **功能新增:** 新增类似 websocket 的 subscribe/send 功能；并完善相应的单元测试 ([1469200](https://github.com/boycgit/ette/commit/1469200))



<a name="0.2.2"></a>
## [0.2.2](https://github.com/boycgit/ette/compare/v0.2.1...v0.2.2) (2018-10-16)


### Bug Fixes

* **bugfix:** middleware should continue run when not return next(); fix context of onerror; ([4b8d157](https://github.com/boycgit/ette/commit/4b8d157))



<a name="0.2.1"></a>
## [0.2.1](https://github.com/boycgit/ette/compare/v0.2.0...v0.2.1) (2018-10-14)


### Bug Fixes

* **bugfix:** 使用 cmd 方式引入第三方包 ([deacd40](https://github.com/boycgit/ette/commit/deacd40))



<a name="0.2.0"></a>
# 0.2.0 (2018-10-14)


### Features

* **功能新增:** 新增类似 koa 的中间件功能逻辑 ([56bcfcf](https://github.com/boycgit/ette/commit/56bcfcf))
* **新增功能:** 迁移 koa-route ([8444e47](https://github.com/boycgit/ette/commit/8444e47))



<a name="0.1.1"></a>
## 0.1.1 (2018-10-14)


### Features

* **功能新增:** 新增类似 koa 的中间件功能逻辑 ([56bcfcf](https://github.com/boycgit/ette/commit/56bcfcf))
* **新增功能:** 迁移 koa-route ([8444e47](https://github.com/boycgit/ette/commit/8444e47))
