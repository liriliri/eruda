<a href="http://eruda.liriliri.io/" target="_blank">
    <img src="http://7xn2zy.com1.z0.glb.clouddn.com/github_eruda2.jpg">
</a>

[中文](doc/README_CN.md)

# Eruda

[![Join the chat at https://gitter.im/liriliri/eruda](https://badges.gitter.im/liriliri/eruda.svg)](https://gitter.im/liriliri/eruda?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![License][license-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/eruda.svg
[npm-url]: https://npmjs.org/package/eruda
[travis-image]: https://img.shields.io/travis/liriliri/eruda.svg
[travis-url]: https://travis-ci.org/liriliri/eruda
[license-image]: https://img.shields.io/npm/l/eruda.svg

Console for Mobile Browsers.

![Eruda](http://7xn2zy.com1.z0.glb.clouddn.com/eruda_screenshot4.jpg)

## Why

Logging things out on mobile browser is never an easy stuff. I used to include
`window onerror alert` script inside pages to find out JavaScript errors, kind
of stupid and inefficient. Desktop browser DevTools is great, and I wish there
is a similar one on mobile side, which leads to the creation of Eruda.

## Demo

![Demo](http://7xn2zy.com1.z0.glb.clouddn.com/eruda_qrcode3.png)

Browse it on your phone: [http://eruda.liriliri.io/](http://eruda.liriliri.io/)

In order to try it for different sites, execute the script below on browser address bar.

```javascript
javascript:(function () { var script = document.createElement('script'); script.src="http://eruda.liriliri.io/eruda.min.js"; document.body.appendChild(script); script.onload = function () { eruda.init() } })();
```

## Features

* [Console](doc/TOOL_API.md#console): Display JavaScript logs.
* [Elements](doc/TOOL_API.md#elements): Check dom state.
* [Network](doc/TOOL_API.md#network): Show performance timing, ajax requests status.
* [Resource](/doc/TOOL_API.md#resources): Show localStorage, cookie information.
* [Info](doc/TOOL_API.md#info): Show url, user agent info.
* [Snippets](doc/TOOL_API.md#snippets): Include snippets used most often.
* [Sources](doc/TOOL_API.md#sources): Html, js, css source viewer.
* [Features](doc/TOOL_API.md#features): Browser feature detections.

## Install

You can get it on npm.

```bash
npm install eruda --save
```

Add this script to your page.

```html
<script src="node_modules/eruda/eruda.min.js"></script>
<script>eruda.init();</script>
```

It's also available on [jsDelivr](http://www.jsdelivr.com/projects/eruda) and [cdnjs](https://cdnjs.com/libraries/eruda).

```html
<script src="//cdn.jsdelivr.net/eruda/1.2.2/eruda.min.js"></script>
<script>eruda.init();</script>
```

The JavaScript file size is quite huge(about 90kb gzipped) and therefore not
suitable to include in mobile pages. It's recommended to make sure eruda is
loaded only when eruda is set to true on url(http://example.com/?eruda=true),
for example:

```javascript
;(function () {
    var src = 'node_modules/eruda/eruda.min.js';
    if (!/eruda=true/.test(window.location) && localStorage.getItem('active-eruda') != 'true') return;
    document.write('<scr' + 'ipt src="' + src + '"></scr' + 'ipt>');
    document.write('<scr' + 'ipt>eruda.init();</scr' + 'ipt>');
})();
```

## Configuration

When initialization, a configuration object can be passed in.

* container: Container element. If not set, it will append an element directly
under html root element.
* tool: Choose which default tools you want, by default all will be added.

```javascript
var el = document.createElement('div');
document.body.appendChild(el);

eruda.init({
    container: el,
    tool: ['console', 'elements']
});
```

## Plugins

It is possible to enhance Eruda with more features by writing plugins. Check
source code of plugins below to learn how to write your own custom tool panels.

* [eruda-fps](https://github.com/liriliri/eruda-fps): Display page fps info.

When writing plugins, you can use utilities exposed by Eruda, see
[docs](doc/UTIL_API.md) here.

## Contribution

Read [Contributing Guide](doc/CONTRIBUTING.md) for development setup instructions.

## Related Projects

* [eustia](https://github.com/liriliri/eustia): Generator of eruda's utility library.
* [freego](https://github.com/surunzi/freego): Http redirect proxy injecting eruda on every page.
