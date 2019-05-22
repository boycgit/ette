# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="0.3.10"></a>
## [0.3.10](https://github.com/boycgit/ette/compare/v0.3.9...v0.3.10) (2019-05-22)


### Bug Fixes

* 🐛 修复 client.unsubscribe 问题 ([d1819a2](https://github.com/boycgit/ette/commit/d1819a2))



<a name="0.3.9"></a>
## [0.3.9](https://github.com/boycgit/ette/compare/v0.3.8...v0.3.9) (2019-02-27)



<a name="0.3.8"></a>
## [0.3.8](https://github.com/boycgit/ette/compare/v0.3.7...v0.3.8) (2019-02-13)


### Bug Fixes

* **打包配置:** 更改 rollup 配置项，基于 .cjs 完成 umd.js 的打包 ([0ad30b6](https://github.com/boycgit/ette/commit/0ad30b6))



<a name="0.3.7"></a>
## [0.3.7](https://github.com/boycgit/ette/compare/v0.3.6...v0.3.7) (2019-02-12)


### Bug Fixes

* **打包输出:** 更改 rollup 打包配置项，生成合法的 umd.js 文件 ([fb687a9](https://github.com/boycgit/ette/commit/fb687a9))



<a name="0.3.6"></a>
## [0.3.6](https://github.com/boycgit/ette/compare/v0.3.5...v0.3.6) (2019-02-12)


### Bug Fixes

* **打包 umd named 配置:** 使用自定义的 umdName ([a0c02d4](https://github.com/boycgit/ette/commit/a0c02d4))



<a name="0.3.5"></a>
## [0.3.5](https://github.com/boycgit/ette/compare/v0.3.4...v0.3.5) (2019-02-12)


### Features

* **功能增强:** 通过新增 isEtteApplication 判断函数，替代 instanceof 的判断，增加可靠性； ([d273f36](https://github.com/boycgit/ette/commit/d273f36))



<a name="0.3.4"></a>
## [0.3.4](https://github.com/boycgit/ette/compare/v0.3.3...v0.3.4) (2019-01-20)


### Features

* **类型声明:** 中间件支持 void 返回类型 ([71e7ad7](https://github.com/boycgit/ette/commit/71e7ad7))



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
